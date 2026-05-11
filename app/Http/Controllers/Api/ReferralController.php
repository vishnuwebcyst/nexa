<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralController extends Controller
{
    public function tree(Request $request)
    {
        $user = $request->user();
        
        // Simple recursive tree building (for small trees)
        // For larger trees, use the Closure Table (ReferralTree)
        return response()->json($this->getTree($user));
    }

    protected function getTree($user)
    {
        $referrals = User::where('referrer_id', $user->id)->get();
        $children = [];
        foreach ($referrals as $referral) {
            $children[] = [
                'id' => $referral->id,
                'username' => $referral->username,
                'name' => $referral->name,
                'children' => $this->getTree($referral)
            ];
        }
        return [
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'children' => $children
        ];
    }
}
