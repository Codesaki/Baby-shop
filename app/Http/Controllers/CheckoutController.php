<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = $this->getCart();
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->withErrors(['cart' => 'Your cart is empty.']);
        }

        $cart->load(['items.product.images', 'items.variant']);

        $addresses = Auth::check() ? Auth::user()->addresses : collect();
        $defaultAddress = $addresses->where('is_default', true)->first();

        return Inertia::render('Checkout/Index', [
            'cart' => $cart,
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'billing_address' => 'required|array',
            'payment_method' => 'required|in:mpesa,card',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'coupon_code' => 'nullable|string',
        ]);

        $cart = $this->getCart();
        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        // Check stock availability
        foreach ($cart->items as $item) {
            if ($item->variant_id) {
                if ($item->variant->stock_quantity < $item->quantity) {
                    return back()->withErrors(['stock' => "Insufficient stock for {$item->product->name}."]);
                }
            } else {
                if ($item->product->quantity < $item->quantity) {
                    return back()->withErrors(['stock' => "Insufficient stock for {$item->product->name}."]);
                }
            }
        }

        $total = $cart->total;

        // Apply coupon if provided
        $discount = 0;
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->first();
            if ($coupon && $coupon->isValid($total)) {
                $discount = $coupon->calculateDiscount($total);
                $total -= $discount;
            } else {
                return back()->withErrors(['coupon' => 'Invalid or expired coupon code.']);
            }
        }

        DB::transaction(function () use ($request, $cart, $total, $discount) {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total,
                ]);

                // Update stock
                if ($item->variant_id) {
                    $item->variant->decrement('stock_quantity', $item->quantity);
                } else {
                    $item->product->decrement('quantity', $item->quantity);
                }
            }

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'amount' => $total,
                'status' => 'pending',
            ]);

            // Clear cart
            $cart->items()->delete();
        });

        return redirect()->route('checkout.success')->with('order', $order ?? null);
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    private function getCart()
    {
        if (Auth::check()) {
            return Cart::where('user_id', Auth::id())->with('items')->first();
        } else {
            $sessionId = Session::getId();
            return Cart::where('session_id', $sessionId)->with('items')->first();
        }
    }
}
