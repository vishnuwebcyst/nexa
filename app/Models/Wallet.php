<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'user_id', 'balance', 'total_earned', 'total_withdrawn'
    ];

    protected $casts = [
        'balance' => 'decimal:4',
        'total_earned' => 'decimal:4',
        'total_withdrawn' => 'decimal:4'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
