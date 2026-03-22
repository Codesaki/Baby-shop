<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_ctas', function (Blueprint $table) {
            $table->id();
            $table->string('headline');
            $table->string('tagline')->nullable();
            $table->text('body_text')->nullable();
            $table->string('button_label')->default('Shop now');
            $table->string('button_url')->default('/');
            $table->string('background_image')->nullable();
            $table->string('gradient_preset')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_ctas');
    }
};
