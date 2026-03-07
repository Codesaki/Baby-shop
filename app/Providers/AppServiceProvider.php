<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // share authentication and cart info with all Inertia responses
        \Inertia\Inertia::share([
            'auth' => function () {
                return [
                    'user' => auth()->user() ? auth()->user()->only('id', 'name', 'email') : null,
                ];
            },
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                    'warning' => session('warning'),
                    'info' => session('info'),
                ];
            },
            'cart' => function () {
                $cartData = ['items' => [], 'count' => 0];

                if (auth()->check()) {
                    $cart = auth()->user()->cart()->with(['items.product.images', 'items.variant'])->first();
                } else {
                    // guest session cart
                    $sessionId = session()->getId();
                    $cart = \App\Models\Cart::where('session_id', $sessionId)
                        ->with(['items.product.images', 'items.variant'])
                        ->first();
                }

                if (isset($cart) && $cart) {
                    $items = $cart->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'slug' => $item->product->slug,
                                'images' => $item->product->images->map(function ($i) {
                                    return ['image_path' => $i->image_path];
                                })->toArray(),
                            ],
                            'variant' => $item->variant ? ['id' => $item->variant->id, 'display_name' => $item->variant->display_name] : null,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                        ];
                    });

                    $cartData['items'] = $items;
                    $cartData['count'] = $cart->items->sum('quantity');
                }

                return $cartData;
            },
        ]);
    }
}
