<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::where('quantity', '>', 0)
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->with('images')
            ->get();

        $newArrivals = Product::where('quantity', '>', 0)
            ->where('is_new_arrival', true)
            ->latest()
            ->take(8)
            ->with('images')
            ->get();

        $popularProducts = Product::where('quantity', '>', 0)
            ->where('is_popular', true)
            ->latest()
            ->take(8)
            ->with('images')
            ->get();

        // Fallback: if no featured/new/popular products, show latest products
        if ($featuredProducts->isEmpty()) {
            $featuredProducts = Product::where('quantity', '>', 0)
                ->latest()
                ->take(8)
                ->with('images')
                ->get();
        }

        if ($newArrivals->isEmpty()) {
            $newArrivals = Product::where('quantity', '>', 0)
                ->latest()
                ->take(8)
                ->with('images')
                ->get();
        }

        $categories = \App\Models\Category::withCount(['products' => function ($query) {
            $query->where('quantity', '>', 0);
        }])->get();

        return Inertia::render('Landing', [
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
            'popularProducts' => $popularProducts,
            'categories' => $categories,
        ]);
    }
}
