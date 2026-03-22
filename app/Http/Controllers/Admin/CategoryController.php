<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name')->paginate(20);
        return Inertia::render('Admin/Categories/Index', compact('categories'));
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        $data['slug'] = Str::slug($data['name']);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store('categories', 'public');
            $data['image_path'] = $path;
        }
        
        Category::create($data);
        return redirect()->route('admin.catalog.categories.index')->with('success', 'Category added.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        $data['slug'] = Str::slug($data['name']);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image_path && Storage::disk('public')->exists($category->image_path)) {
                Storage::disk('public')->delete($category->image_path);
            }
            $file = $request->file('image');
            $path = $file->store('categories', 'public');
            $data['image_path'] = $path;
        }
        
        $category->update($data);
        return redirect()->route('admin.catalog.categories.index')->with('success', 'Category updated.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return back()->with('success', 'Category removed.');
    }

    // API helper for subcategories
    public function subCategories(Category $category)
    {
        return response()->json($category->subCategories()->get());
    }
}
