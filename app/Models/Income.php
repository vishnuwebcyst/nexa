<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $fillable = [
        'user_id', 'from_user_id', 'type', 'amount', 'level', 'package_id'
    ];

    protected $casts = [
        'amount' => 'decimal:4'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
