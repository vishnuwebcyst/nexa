<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = [
        'user_id', 'amount', 'fee', 'net_amount', 'status', 'wallet_address', 'tx_hash'
    ];

    protected $casts = [
        'amount' => 'decimal:4',
        'fee' => 'decimal:4',
        'net_amount' => 'decimal:4'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
