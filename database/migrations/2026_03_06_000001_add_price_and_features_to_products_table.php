<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->nullable()->after('quantity');
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');
            $table->boolean('is_featured')->default(false)->after('discount_price');
            $table->boolean('is_new_arrival')->default(false)->after('is_featured');
            $table->boolean('is_popular')->default(false)->after('is_new_arrival');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['price', 'discount_price', 'is_featured', 'is_new_arrival', 'is_popular']);
        });
    }
};
