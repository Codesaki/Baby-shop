<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\ProductImage;
use App\Models\StockMovement;
use App\Models\Media;
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
        $mediaImages = Media::query()
            ->where('mime_type', 'like', 'image/%')
            ->orderByDesc('created_at')
            ->limit(60)
            ->get(['id', 'original_filename', 'path', 'mime_type']);

        return Inertia::render('Admin/Products/Create', compact('categories', 'subCategories', 'mediaImages'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:64',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'short_description' => 'required',
            'long_description' => 'required',
            'quantity' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_popular' => 'boolean',
            'images' => 'array|max:5',
            'images.*' => 'image|max:2048',
            'media_ids' => 'array',
            'media_ids.*' => 'integer|exists:media,id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['created_by'] = Auth::id();
        $validated['quantity'] = (int) ($validated['quantity'] ?? 0);

        $category = Category::findOrFail($validated['category_id']);
        $subCategory = SubCategory::findOrFail($validated['sub_category_id']);
        $skuInput = trim((string) ($validated['sku'] ?? ''));
        if ($skuInput === '') {
            $validated['sku'] = $this->generateUniqueSku($category, $subCategory);
        } else {
            if (Product::where('sku', $skuInput)->exists()) {
                return back()->withErrors(['sku' => 'This SKU is already taken.'])->withInput();
            }
            $validated['sku'] = $skuInput;
        }

        $product = Product::create($validated);

        if ($product->quantity > 0) {
            $product->stockMovements()->create([
                'type' => 'in',
                'quantity' => $product->quantity,
                'reference' => 'Initial stock',
                'created_by' => Auth::id(),
            ]);
        }

        if ($request->hasFile('images')) {
            $imageCount = 1;
            foreach ($request->file('images') as $img) {
                $filename = $this->generateImageFilename($product, $imageCount, $img);
                $path = $img->storeAs('products', $filename, 'public');
                $product->images()->create(['image_path' => $path]);

                Media::firstOrCreate(
                    ['disk' => 'public', 'path' => $path],
                    [
                        'filename' => basename($path),
                        'original_filename' => $img->getClientOriginalName(),
                        'mime_type' => $img->getMimeType(),
                        'size' => $img->getSize(),
                        'folder' => 'products',
                        'uploaded_by' => Auth::id(),
                    ]
                );
                $imageCount++;
            }
        }

        if (!empty($validated['media_ids'])) {
            $mediaItems = Media::query()->whereIn('id', $validated['media_ids'])->get();
            foreach ($mediaItems as $media) {
                $product->images()->firstOrCreate([
                    'image_path' => $media->path,
                ]);
            }
        }

        return redirect()->route('admin.catalog.products.index')->with('success', 'Product created.');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::orderBy('name')->get();
        $subCategories = SubCategory::orderBy('name')->get();
        $product->load('images');
        $mediaImages = Media::query()
            ->where('mime_type', 'like', 'image/%')
            ->orderByDesc('created_at')
            ->limit(60)
            ->get(['id', 'original_filename', 'path', 'mime_type']);

        return Inertia::render('Admin/Products/Edit', compact('product', 'categories', 'subCategories', 'mediaImages'));
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
            'low_stock_threshold' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_popular' => 'boolean',
            'images' => 'array|max:5',
            'images.*' => 'image|max:2048',
            'media_ids' => 'array',
            'media_ids.*' => 'integer|exists:media,id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product->update($validated);

        if ($request->hasFile('images')) {
            $imageCount = $product->images()->count() + 1;
            foreach ($request->file('images') as $img) {
                $filename = $this->generateImageFilename($product, $imageCount, $img);
                $path = $img->storeAs('products', $filename, 'public');
                $product->images()->create(['image_path' => $path]);

                Media::firstOrCreate(
                    ['disk' => 'public', 'path' => $path],
                    [
                        'filename' => basename($path),
                        'original_filename' => $img->getClientOriginalName(),
                        'mime_type' => $img->getMimeType(),
                        'size' => $img->getSize(),
                        'folder' => 'products',
                        'uploaded_by' => Auth::id(),
                    ]
                );
                $imageCount++;
            }
        }

        if (!empty($validated['media_ids'])) {
            $mediaItems = Media::query()->whereIn('id', $validated['media_ids'])->get();
            foreach ($mediaItems as $media) {
                $product->images()->firstOrCreate([
                    'image_path' => $media->path,
                ]);
            }
        }

        // deleting images handled via separate endpoint maybe

        return redirect()->route('admin.catalog.products.index')->with('success', 'Product updated.');
    }

    public function destroyImage(Product $product, ProductImage $image)
    {
        abort_unless($image->product_id === $product->id, 404);
        $image->delete();
        return back()->with('success', 'Image removed from product.');
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

    /**
     * SKU pattern: {CAT}-{SUB}-{NNNNNN} using category & subcategory name slugs (letters only), unique suffix.
     */
    private function generateUniqueSku(Category $category, SubCategory $subCategory): string
    {
        $catPart = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', Str::slug($category->name)));
        $subPart = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', Str::slug($subCategory->name)));
        $catPart = Str::limit($catPart ?: 'CAT', 4, '');
        $subPart = Str::limit($subPart ?: 'SUB', 4, '');

        do {
            $suffix = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $sku = "{$catPart}-{$subPart}-{$suffix}";
        } while (Product::where('sku', $sku)->exists());

        return $sku;
    }
}
