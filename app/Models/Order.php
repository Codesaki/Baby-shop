<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'total_amount',
        'payment_status',
        'payment_method',
        'shipping_address',
        'billing_address',
        'phone',
        'notes',
        'viewed_at',
        'payment_attempted_at',
        'paid_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'payment_attempted_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(Str::random(8));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Mark order as pending payment (STK push initiated)
     */
    public function markPending()
    {
        return $this->update([
            'status' => 'pending',
            'payment_attempted_at' => now(),
        ]);
    }

    /**
     * Mark order as paid
     */
    public function markPaid()
    {
        return $this->update([
            'status' => 'paid',
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    /**
     * Mark order as cancelled
     */
    public function markCancelled()
    {
        return $this->update([
            'status' => 'cancelled',
            'payment_status' => 'failed',
        ]);
    }

    /**
     * Mark order as shipped (only if currently paid)
     */
    public function markShipped()
    {
        if ($this->status !== 'paid') {
            throw new \Exception('Only paid orders can be marked as shipped');
        }

        return $this->update(['status' => 'shipped']);
    }

    /**
     * Check if order status is immutable (cancelled and refunded orders cannot be changed)
     */
    public function isImmutable()
    {
        return in_array($this->status, ['cancelled']);
    }

    /**
     * Check if order has timed out (5 minutes for pending orders)
     */
    public function hasTimedOut()
    {
        if ($this->status !== 'pending') {
            return false;
        }

        return $this->payment_attempted_at && $this->payment_attempted_at->addMinutes(5)->isPast();
    }

    /**
     * Get the revenue amount for this order (only for paid/shipped status)
     */
    public function getRevenueAmount()
    {
        if (in_array($this->status, ['paid', 'shipped'])) {
            return $this->total_amount;
        }

        return 0;
    }
}
