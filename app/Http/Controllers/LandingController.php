<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\LandingCta;
use App\Models\Product;
use App\Models\Media;
use App\Models\Setting;
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

        // Transform products to cast decimal fields to float
        $castPrices = function ($products) {
            return $products->map(function ($product) {
                $product->price = (float) $product->price;
                $product->discount_price = $product->discount_price ? (float) $product->discount_price : null;
                return $product;
            });
        };

        $featuredProducts = $castPrices($featuredProducts);
        $newArrivals = $castPrices($newArrivals);
        $popularProducts = $castPrices($popularProducts);

        $categories = Category::withCount(['products' => function ($query) {
            $query->where('quantity', '>', 0);
        }])->get();

        $topCategories = Category::query()
            ->withCount(['products' => function ($query) {
                $query->where('quantity', '>', 0);
            }])
            ->orderByDesc('products_count')
            ->take(5)
            ->get();

        $categoryShowcases = $topCategories->map(function ($cat) use ($castPrices) {
            $products = Product::query()
                ->where('category_id', $cat->id)
                ->where('quantity', '>', 0)
                ->with('images')
                ->latest()
                ->take(8)
                ->get();

            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'products_count' => (int) $cat->products_count,
                'products' => $castPrices($products)->values(),
            ];
        })->values();

        $landingCtas = LandingCta::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $heroImageId = Setting::get('hero_image_id');
        $heroImage = null;
        if ($heroImageId) {
            $heroMedia = Media::find($heroImageId);
            if ($heroMedia) {
                $heroImage = '/storage/'.$heroMedia->path;
            }
        }

        $instagramImageIds = Setting::get('instagram_image_ids', []); 
        $instagramImages = [];
        if (is_array($instagramImageIds) && count($instagramImageIds) > 0) {
            $instagramImages = Media::whereIn('id', $instagramImageIds)->get()->map(function ($media) {
                return '/storage/'.$media->path;
            })->toArray();
        }

        return Inertia::render('Landing', [
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
            'popularProducts' => $popularProducts,
            'categories' => $categories,
            'categoryShowcases' => $categoryShowcases,
            'landingCtas' => $landingCtas,
            'heroImage' => $heroImage,
            'instagramImages' => $instagramImages,
        ]);
    }
}
