<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id', 'type', 'category', 'amount', 'status', 'description'
    ];

    protected $casts = [
        'amount' => 'decimal:4'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
