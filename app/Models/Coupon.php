<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'minimum_amount',
        'usage_limit',
        'used_count',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'expiry_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValid($amount = 0)
    {
        if (!$this->is_active) return false;
        if ($this->expiry_date && $this->expiry_date->isPast()) return false;
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) return false;
        if ($this->minimum_amount && $amount < $this->minimum_amount) return false;

        return true;
    }

    public function calculateDiscount($amount)
    {
        if ($this->discount_type === 'percentage') {
            return ($amount * $this->discount_value) / 100;
        }

        return min($this->discount_value, $amount);
    }
}
