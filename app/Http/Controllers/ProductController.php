<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        $product->load(['images', 'category', 'subCategory']);
        
        // Cast decimal fields to float for JSON serialization
        $product->price = (float) $product->price;
        $product->discount_price = $product->discount_price ? (float) $product->discount_price : null;

        return Inertia::render('Product/Show', [
            'product' => $product,
        ]);
    }

    public function search(Request $request)
    {
        $query = trim((string) $request->input('q', ''));

        if ($query === '') {
            return redirect()->route('landing');
        }

        $terms = preg_split('/\s+/', $query) ?: [];

        $productsQuery = Product::query()
            ->with(['images', 'category', 'subCategory'])
            ->where('quantity', '>', 0);

        foreach ($terms as $term) {
            $like = '%'.$term.'%';

            $productsQuery->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('short_description', 'like', $like)
                    ->orWhere('long_description', 'like', $like)
                    ->orWhere('sku', 'like', $like)
                    ->orWhereHas('category', function ($cq) use ($like) {
                        $cq->where('name', 'like', $like)
                            ->orWhere('slug', 'like', $like);
                    })
                    ->orWhereHas('subCategory', function ($sq) use ($like) {
                        $sq->where('name', 'like', $like)
                            ->orWhere('slug', 'like', $like);
                    });
            });
        }

        $products = $productsQuery
            ->orderByDesc('created_at')
            ->paginate(16)
            ->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->price = (float) $product->price;
            $product->discount_price = $product->discount_price ? (float) $product->discount_price : null;
            return $product;
        });

        return Inertia::render('Search/Results', [
            'query' => $query,
            'products' => $products,
        ]);
    }
}
