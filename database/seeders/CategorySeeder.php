<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $cats = [
            'Clothing' => ['Baby', 'Toddler', 'Mommy'],
            'Toys & Games' => ['Rattles', 'Puzzles'],
            'Feeding' => ['Bottles', 'Utensils'],
        ];

        foreach ($cats as $name => $subs) {
            $cat = Category::firstOrCreate([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
            foreach ($subs as $sub) {
                SubCategory::firstOrCreate([
                    'category_id' => $cat->id,
                    'name' => $sub,
                    'slug' => Str::slug($sub),
                ]);
            }
        }
    }
}
