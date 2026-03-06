<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\ProductImage;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'subCategory'])
            ->when($request->search, fn($q) => $q->where('name', 'like', '%'.$request->search.'%'));

        $products = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();
        $subCategories = SubCategory::orderBy('name')->get();
        return Inertia::render('Admin/Products/Create', compact('categories', 'subCategories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|unique:products',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'short_description' => 'required',
            'long_description' => 'required',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_popular' => 'boolean',
            'images' => 'array|max:5',
            'images.*' => 'image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = Auth::id();

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            $imageCount = 1;
            foreach ($request->file('images') as $img) {
                $filename = $this->generateImageFilename($product, $imageCount, $img);
                $path = $img->storeAs('products', $filename, 'public');
                $product->images()->create(['image_path' => $path]);
                $imageCount++;
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::orderBy('name')->get();
        $subCategories = SubCategory::orderBy('name')->get();
        $product->load('images');
        return Inertia::render('Admin/Products/Edit', compact('product', 'categories', 'subCategories'));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        // handle stock addition separately
        if ($request->has('add_stock')) {
            $data = $request->validate([
                'stock_quantity' => 'required|integer|min:1',
                'stock_reference' => 'nullable|string|max:255',
            ]);
            $product->stockMovements()->create([
                'type' => 'in',
                'quantity' => $data['stock_quantity'],
                'reference' => $data['stock_reference'] ?? null,
                'created_by' => Auth::id(),
            ]);
            $product->increment('quantity', $data['stock_quantity']);
            return back()->with('success', 'Stock added.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|unique:products,sku,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'short_description' => 'required',
            'long_description' => 'required',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_popular' => 'boolean',
            'images' => 'array|max:5',
            'images.*' => 'image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product->update($validated);

        if ($request->hasFile('images')) {
            $imageCount = $product->images()->count() + 1;
            foreach ($request->file('images') as $img) {
                $filename = $this->generateImageFilename($product, $imageCount, $img);
                $path = $img->storeAs('products', $filename, 'public');
                $product->images()->create(['image_path' => $path]);
                $imageCount++;
            }
        }

        // deleting images handled via separate endpoint maybe

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return back()->with('success', 'Product deleted.');
    }

    public function addStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
            'reference' => 'nullable|string|max:255',
        ]);

        $product->stockMovements()->create([
            'type' => 'in',
            'quantity' => $data['quantity'],
            'reference' => $data['reference'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $product->increment('quantity', $data['quantity']);

        return back()->with('success', 'Stock added.');
    }

    /**
     * Generate SEO-friendly filename for product images.
     * Format: {slug}-{sku}-{sequence}.{ext}
     */
    private function generateImageFilename(Product $product, int $sequence, $file): string
    {
        $ext = $file->getClientOriginalExtension();
        return "{$product->slug}-{$product->sku}-{$sequence}.{$ext}";
    }
}
