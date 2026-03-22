<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\MpesaService;
use App\Services\PesapalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line' => 'required|string',
            'shipping_address.city' => 'required|string|max:100',
            'billing_address' => 'required|array',
            'billing_address.name' => 'required|string|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'billing_address.address_line' => 'required|string',
            'billing_address.city' => 'required|string|max:100',
            'payment_method' => 'required|in:mpesa,card',
            'mpesa_number' => 'required_if:payment_method,mpesa|string|max:15',
            'card_number' => 'required_if:payment_method,card|string|max:19',
            'expiry_date' => 'required_if:payment_method,card|string|max:5',
            'cvv' => 'required_if:payment_method,card|string|max:4',
            'phone' => 'required|string|max:20',
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

        $orderId = null;
        
        DB::transaction(function () use ($request, $cart, $total, $discount, &$orderId) {
            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'phone' => $request->phone,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
            ]);
            
            $orderId = $order->id;

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

        // Initiate payment
        $order = Order::find($orderId);
        $payment = $order->payment;

        if ($request->payment_method === 'mpesa') {
            $mpesaService = new MpesaService();
            $result = $mpesaService->initiateSTKPush(
                $request->mpesa_number,
                $total,
                $order->order_number,
                "Payment for order {$order->order_number}"
            );

            if (isset($result['ResponseCode']) && $result['ResponseCode'] == '0') {
                $payment->update([
                    'transaction_reference' => $result['CheckoutRequestID'],
                    'gateway_response' => $result,
                ]);
            } else {
                // Handle error, but for now, proceed
                Log::error('MPESA STK Push failed', $result);
            }
        } elseif ($request->payment_method === 'card') {
            $pesapalService = new PesapalService();
            $result = $pesapalService->initiatePayment([
                'amount' => $total,
                'order_id' => $order->id,
                'email' => Auth::user()->email ?? 'guest@example.com',
                'phone' => $request->phone,
                'first_name' => $request->shipping_address['name'],
                'last_name' => '',
            ]);

            if (isset($result['order_tracking_id'])) {
                $payment->update([
                    'transaction_reference' => $result['order_tracking_id'],
                    'gateway_response' => $result,
                ]);
                // Redirect to pesapal payment page
                return redirect($result['redirect_url']);
            } else {
                Log::error('PesaPal initiation failed', $result);
            }
        }

        return redirect()->route('checkout.success')->with('orderId', $orderId);
    }

    public function success(Request $request)
    {
        $orderId = $request->session()->get('orderId');
        $order = $orderId ? Order::with(['items.product.images', 'items.variant'])->find($orderId) : null;
        
        if (!$order) {
            return redirect()->route('landing')->withErrors(['order' => 'Order not found.']);
        }
        
        // Transform items to ensure prices are floats
        $items = $order->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'total' => (float) $item->total,
                'product' => $item->product,
                'variant' => $item->variant,
            ];
        });
        
        return Inertia::render('Checkout/Success', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'total_amount' => (float) $order->total_amount,
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'phone' => $order->phone,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toIso8601String(),
                'items' => $items,
            ],
        ]);
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
