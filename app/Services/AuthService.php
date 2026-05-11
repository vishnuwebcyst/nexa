<?php

namespace App\Services;

use App\Models\User;
use App\Models\Wallet;
use App\Models\ReferralTree;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthService
{
    public function register(array $data)
    {
        return DB::transaction(function () use ($data) {
            $referrer = null;
            if (!empty($data['referral_code'])) {
                $referrer = User::where('referral_code', $data['referral_code'])->first();
            }

            $user = User::create([
                'name' => $data['name'],
                'username' => $data['username'],
                'referral_code' => $this->generateUniqueReferralCode(),
                'referrer_id' => $referrer ? $referrer->id : null,
                'wallet_address' => $data['wallet_address'],
                'status' => 'active'
            ]);

            // Create Wallet
            Wallet::create(['user_id' => $user->id]);

            // Build Referral Tree
            $this->buildReferralTree($user, $referrer);

            return $user;
        });
    }

    protected function buildReferralTree(User $user, ?User $referrer)
    {
        // Every user is their own ancestor at distance 0
        ReferralTree::create([
            'user_id' => $user->id,
            'ancestor_id' => $user->id,
            'distance' => 0
        ]);

        if ($referrer) {
            // Copy referrer's ancestors and add new user
            $referrerAncestors = ReferralTree::where('user_id', $referrer->id)->get();
            foreach ($referrerAncestors as $ancestorItem) {
                ReferralTree::create([
                    'user_id' => $user->id,
                    'ancestor_id' => $ancestorItem->ancestor_id,
                    'distance' => $ancestorItem->distance + 1
                ]);
            }
        }
    }

    protected function generateUniqueReferralCode()
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (User::where('referral_code', $code)->exists());
        
        return $code;
    }
}
