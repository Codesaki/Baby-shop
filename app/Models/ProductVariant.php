<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'value',
        'price_adjustment',
        'stock_quantity',
    ];

    protected $casts = [
        'price_adjustment' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getDisplayNameAttribute()
    {
        return ucfirst($this->name) . ': ' . $this->value;
    }

    public function getAdjustedPriceAttribute()
    {
        return $this->product->price + $this->price_adjustment;
    }
}
