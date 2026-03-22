<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $wishlists = Auth::user()->wishlist()->with(['product.images'])->get();

        return Inertia::render('Account/Wishlist', [
            'wishlists' => $wishlists,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return back()->with('info', 'This product is already in your wishlist.');
        }

        Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
        ]);

        return back()->with('success', 'Added to your wishlist.');
    }

    public function destroy($productId)
    {
        Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        return back()->with('success', 'Removed from your wishlist.');
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->delete();

        $product = Product::findOrFail($request->product_id);
        if ($product->quantity < 1) {
            return back()->with('error', 'This product is out of stock.');
        }

        $price = $product->discount_price !== null && $product->discount_price !== ''
            ? (float) $product->price - (float) $product->discount_price
            : (float) $product->price;

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        $existingItem = $cart->items()
            ->where('product_id', $product->id)
            ->whereNull('variant_id')
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + 1,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'variant_id' => null,
                'quantity' => 1,
                'price' => $price,
            ]);
        }

        return back()->with('cart_success', [
            'product_name' => $product->name,
        ]);
    }
}
