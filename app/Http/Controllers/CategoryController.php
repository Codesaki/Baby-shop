<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show(Category $category)
    {
        $products = $category->products()
            ->where('quantity', '>', 0)
            ->with('images')
            ->paginate(12);

        // Transform products to ensure decimal fields are floats
        $products->getCollection()->transform(function ($product) {
            $product->price = (float) $product->price;
            $product->discount_price = $product->discount_price ? (float) $product->discount_price : null;
            return $product;
        });

        return Inertia::render('Category/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}