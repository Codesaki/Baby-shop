<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingCta extends Model
{
    protected $fillable = [
        'headline',
        'tagline',
        'body_text',
        'button_label',
        'button_url',
        'background_image',
        'gradient_preset',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
