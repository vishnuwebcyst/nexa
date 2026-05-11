<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name', 'type', 'price', 'partner_bonus', 'elevation_reward', 'network_reward', 'loop_income', 'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'elevation_reward' => 'decimal:2',
        'network_reward' => 'decimal:2',
        'loop_income' => 'decimal:2',
        'status' => 'boolean'
    ];
}
