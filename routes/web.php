<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderAdminController;
use App\Http\Controllers\Admin\CustomerAdminController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\ReviewAdminController;
use App\Http\Controllers\Admin\CouponAdminController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// public landing page
Route::get('/', [LandingController::class, 'index'])->name('landing');

// product detail page
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// category pages
Route::get('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'show'])->name('categories.show');

// cart routes
Route::get('/cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [\App\Http\Controllers\CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/items/{item}', [\App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/items/{item}', [\App\Http\Controllers\CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/cart', [\App\Http\Controllers\CartController::class, 'clear'])->name('cart.clear');

// checkout routes
Route::get('/checkout', [\App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [\App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [\App\Http\Controllers\CheckoutController::class, 'success'])->name('checkout.success');

// order routes
Route::middleware('auth')->group(function () {
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [\App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/cancel', [\App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');

    // wishlist routes
    Route::get('/wishlist', [\App\Http\Controllers\WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [\App\Http\Controllers\WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{productId}', [\App\Http\Controllers\WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::post('/wishlist/add-to-cart', [\App\Http\Controllers\WishlistController::class, 'addToCart'])->name('wishlist.add-to-cart');

    // transactions
    Route::get('/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('transactions.index');
});

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
        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Catalog Management
        Route::prefix('catalog')->name('catalog.')->group(function () {
            Route::resource('categories', CategoryController::class)->except(['show']);
            Route::resource('sub-categories', SubCategoryController::class)->except(['show']);
            Route::resource('products', AdminProductController::class);
            Route::get('products/{id}/stock', [AdminProductController::class, 'addStock'])->name('products.stock');
        });

        // Orders
        Route::resource('orders', OrderAdminController::class)->only(['index', 'show', 'update']);
        Route::post('orders/{order}/refund', [OrderAdminController::class, 'refund'])->name('orders.refund');

        // Customers
        Route::resource('customers', CustomerAdminController::class)->only(['index', 'show', 'update']);

        // Marketing
        Route::prefix('marketing')->name('marketing.')->group(function () {
            Route::resource('coupons', CouponAdminController::class);
        });

        // Content Management
        Route::prefix('content')->name('content.')->group(function () {
            Route::resource('pages', PageController::class);
            Route::resource('contact-messages', ContactMessageController::class)->only(['index', 'show', 'destroy']);
            Route::post('contact-messages/{contactMessage}/reply', [ContactMessageController::class, 'reply'])->name('contact-messages.reply');
            Route::patch('contact-messages/{contactMessage}/status', [ContactMessageController::class, 'updateStatus'])->name('contact-messages.status');
            Route::resource('reviews', ReviewAdminController::class)->only(['index', 'destroy']);
            Route::patch('reviews/{review}/approve', [ReviewAdminController::class, 'approve'])->name('reviews.approve');
            Route::patch('reviews/{review}/reject', [ReviewAdminController::class, 'reject'])->name('reviews.reject');
        });

        // Media Library
        Route::resource('media', MediaController::class)->only(['index', 'store', 'destroy']);

        // Analytics & Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('sales', [ReportController::class, 'salesReport'])->name('sales');
            Route::get('products', [ReportController::class, 'productReport'])->name('products');
            Route::get('customers', [ReportController::class, 'customerReport'])->name('customers');
        });

        // Activity Logs
        Route::resource('activity-logs', ActivityLogController::class)->only(['index']);

        // System Configuration
        Route::prefix('system')->name('system.')->group(function () {
            Route::resource('settings', SettingsController::class)->only(['index', 'update']);
            Route::resource('admin-users', AdminUserController::class);
            Route::resource('roles', RoleController::class);
        });
    });

Route::get('auth/google', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'handleGoogleCallback']);

require __DIR__.'/auth.php';
