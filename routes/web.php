<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// public landing page
Route::get('/', [LandingController::class, 'index'])->name('landing');

// product detail page
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// category pages
Route::get('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'show'])->name('categories.show');

// API helpers
Route::get('/api/categories/{category}/sub-categories', [\App\Http\Controllers\Admin\CategoryController::class, 'subCategories']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// admin area
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', function () { return Inertia::render('Admin/Dashboard'); })->name('dashboard');

        // categories
        Route::resource('categories', CategoryController::class)->except(['show']);

        // sub-categories
        Route::resource('sub-categories', SubCategoryController::class)->except(['show']);

        // products
        Route::get('products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [AdminProductController::class, 'create'])->name('products.create');
        Route::post('products', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('products/{id}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{id}', [AdminProductController::class, 'update'])->name('products.update');
        Route::patch('products/{id}', [AdminProductController::class, 'update']);
        Route::delete('products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::get('products/{id}/stock', [AdminProductController::class, 'addStock'])->name('products.stock');
    });

require __DIR__.'/auth.php';
