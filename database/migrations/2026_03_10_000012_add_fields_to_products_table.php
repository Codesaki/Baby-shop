<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add missing fields in a safe way
            if (!Schema::hasColumn('products', 'status')) {
                $table->enum('status', ['active', 'draft', 'archived'])->default('draft')->after('is_active');
            }
            if (!Schema::hasColumn('products', 'visibility')) {
                $table->enum('visibility', ['public', 'hidden'])->default('public')->after('status');
            }
            if (!Schema::hasColumn('products', 'stock_quantity')) {
                $table->integer('stock_quantity')->default(0)->after('quantity');
            }
            if (!Schema::hasColumn('products', 'low_stock_threshold')) {
                $table->integer('low_stock_threshold')->default(10)->after('stock_quantity');
            }
            if (!Schema::hasColumn('products', 'track_inventory')) {
                $table->boolean('track_inventory')->default(true)->after('low_stock_threshold');
            }
            if (!Schema::hasColumn('products', 'allow_backorders')) {
                $table->boolean('allow_backorders')->default(false)->after('track_inventory');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('products', 'visibility')) {
                $table->dropColumn('visibility');
            }
            if (Schema::hasColumn('products', 'stock_quantity')) {
                $table->dropColumn('stock_quantity');
            }
            if (Schema::hasColumn('products', 'low_stock_threshold')) {
                $table->dropColumn('low_stock_threshold');
            }
            if (Schema::hasColumn('products', 'track_inventory')) {
                $table->dropColumn('track_inventory');
            }
            if (Schema::hasColumn('products', 'allow_backorders')) {
                $table->dropColumn('allow_backorders');
            }
        });
    }
};
