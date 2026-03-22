<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    private const COLLECTIONS = [
        'baby-care' => 'Baby Care',
        'clothing' => 'Clothing',
        'feeding' => 'Feeding',
        'mommy' => 'Mommy',
        'playtime' => 'Playtime',
        'travel' => 'Travel',
        'warmth' => 'Warmth',
    ];

    public function show(Request $request, string $slug)
    {
        $name = self::COLLECTIONS[$slug] ?? ucfirst(str_replace('-', ' ', $slug));

        $products = Product::query()
            ->with(['images'])
            ->where('quantity', '>', 0)
            ->where(function ($q) use ($slug, $name) {
                $q->whereHas('category', function ($cq) use ($slug, $name) {
                    $cq->where('slug', $slug)
                        ->orWhere('name', 'like', '%'.$name.'%');
                })->orWhereHas('subCategory', function ($sq) use ($slug, $name) {
                    $sq->where('slug', $slug)
                        ->orWhere('name', 'like', '%'.$name.'%');
                });
            })
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->price = (float) $product->price;
            $product->discount_price = $product->discount_price ? (float) $product->discount_price : null;
            return $product;
        });

        return Inertia::render('Category/Show', [
            'category' => [
                'name' => $name,
                'slug' => $slug,
            ],
            'products' => $products,
        ]);
    }
}

