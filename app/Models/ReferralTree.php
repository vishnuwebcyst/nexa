<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralTree extends Model
{
    protected $table = 'referral_tree';

    protected $fillable = [
        'user_id', 'ancestor_id', 'distance'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ancestor()
    {
        return $this->belongsTo(User::class, 'ancestor_id');
    }
}
