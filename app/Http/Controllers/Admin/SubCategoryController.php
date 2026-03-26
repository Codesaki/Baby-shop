<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
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
            'name' => ['required', 'string', 'max:255', Rule::unique('sub_categories')->where(function ($query) use ($request) {
                return $query->where('category_id', $request->category_id);
            })],
            'category_id' => 'required|exists:categories,id',
        ], [
            'name.unique' => 'This sub-category already exists for this category.',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if (SubCategory::where('slug', $data['slug'])->exists()) {
            return back()
                ->withErrors(['name' => 'This sub-category slug already exists. Please choose a different name.'])
                ->withInput();
        }

        SubCategory::create($data);
        return redirect()->route('admin.catalog.sub-categories.index')->with('success', 'Sub-category added.');
    }

    public function edit(SubCategory $subCategory)
    {
        $categories = Category::orderBy('name')->get();
        return Inertia::render('Admin/SubCategories/Edit', compact('subCategory', 'categories'));
    }

    public function update(Request $request, SubCategory $subCategory)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('sub_categories')->where(function ($query) use ($request, $subCategory) {
                return $query->where('category_id', $request->category_id)->where('id', '<>', $subCategory->id);
            })],
            'category_id' => 'required|exists:categories,id',
        ], [
            'name.unique' => 'This sub-category already exists for this category.',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if (SubCategory::where('slug', $data['slug'])->where('id', '<>', $subCategory->id)->exists()) {
            return back()
                ->withErrors(['name' => 'This sub-category slug already exists. Please choose a different name.'])
                ->withInput();
        }

        $subCategory->update($data);
        return redirect()->route('admin.catalog.sub-categories.index')->with('success', 'Sub-category updated.');
    }

    private function generateUniqueSlug(string $baseSlug, int $ignoreId = null)
    {
        $slug = $baseSlug;
        $count = 0;

        while (SubCategory::where('slug', $slug)
            ->when($ignoreId, fn($q) => $q->where('id', '<>', $ignoreId))
            ->exists())
        {
            $count++;
            $slug = $baseSlug . '-' . $count;
        }

        return $slug;
    }

    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();
        return back()->with('success', 'Sub-category removed.');
    }
}
