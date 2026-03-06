<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = SubCategory::with('category')
            ->when($request->search, fn($q) => $q->where('name', 'like', '%'.$request->search.'%'));

        $subCategories = $query->orderBy('name')->paginate(20);

        return Inertia::render('Admin/SubCategories/Index', [
            'subCategories' => $subCategories,
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();
        return Inertia::render('Admin/SubCategories/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);
        $data['slug'] = Str::slug($data['name']);
        SubCategory::create($data);
        return redirect()->route('admin.sub-categories.index')->with('success', 'Sub-category added.');
    }

    public function edit(SubCategory $subCategory)
    {
        $categories = Category::orderBy('name')->get();
        return Inertia::render('Admin/SubCategories/Edit', compact('subCategory', 'categories'));
    }

    public function update(Request $request, SubCategory $subCategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);
        $data['slug'] = Str::slug($data['name']);
        $subCategory->update($data);
        return redirect()->route('admin.sub-categories.index')->with('success', 'Sub-category updated.');
    }

    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();
        return back()->with('success', 'Sub-category removed.');
    }
}
