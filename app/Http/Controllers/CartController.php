<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = $this->getOrCreateCart();
        $cart->load(['items.product.images', 'items.variant']);

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'items' => $cart->items,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check stock availability
        if ($request->variant_id) {
            $variant = ProductVariant::findOrFail($request->variant_id);
            if ($variant->stock_quantity < $request->quantity) {
                return back()->withErrors(['quantity' => 'Insufficient stock for this variant.']);
            }
            $price = $product->price + $variant->price_adjustment;
        } else {
            if ($product->quantity < $request->quantity) {
                return back()->withErrors(['quantity' => 'Insufficient stock.']);
            }
            $price = $product->price;
        }

        $cart = $this->getOrCreateCart();

        // Check if item already exists in cart
        $existingItem = $cart->items()
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
                'price' => $price,
            ]);
        }

        return back()->with('success', 'Product added to cart.');
    }

    public function update(Request $request, CartItem $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock availability
        if ($item->variant_id) {
            $variant = $item->variant;
            if ($variant->stock_quantity < $request->quantity) {
                return response()->json(['error' => 'Insufficient stock.'], 422);
            }
        } else {
            $product = $item->product;
            if ($product->quantity < $request->quantity) {
                return response()->json(['error' => 'Insufficient stock.'], 422);
            }
        }

        $item->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true]);
    }

    public function destroy(CartItem $item)
    {
        $item->delete();
        return back()->with('success', 'Item removed from cart.');
    }

    public function clear()
    {
        $cart = $this->getOrCreateCart();
        $cart->items()->delete();

        return back()->with('success', 'Cart cleared.');
    }

    private function getOrCreateCart()
    {
        if (Auth::check()) {
            return Cart::firstOrCreate(['user_id' => Auth::id()]);
        } else {
            $sessionId = Session::getId();
            return Cart::firstOrCreate(['session_id' => $sessionId]);
        }
    }
}
