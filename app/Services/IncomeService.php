<?php

namespace App\Services;

use App\Models\User;
use App\Models\Package;
use App\Models\Income;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\ReferralTree;
use Illuminate\Support\Facades\DB;

class IncomeService
{
    /**
     * Distribute income when a user purchases a package.
     */
    public function distribute(User $user, Package $package)
    {
        DB::transaction(function () use ($user, $package) {
            // 1. Partner Bonus or Elevation Reward
            if ($package->type === 'joining') {
                $this->distributePartnerBonus($user, $package);
            } else {
                $this->distributeElevationReward($user, $package);
            }

            // 2. Network Reward (10 Levels)
            $this->distributeNetworkReward($user, $package);

            // 3. Loop Income (Global Auto-Pool)
            $this->distributeLoopIncome($user, $package);
            
            // 4. Milestone Bonus Check
            $this->checkMilestoneBonus($user->referrer);
        });
    }

    /**
     * Partner Bonus (Direct Referral) - 50% for Joining Package.
     */
    protected function distributePartnerBonus(User $user, Package $package)
    {
        $referrer = $user->referrer;
        if ($referrer && $package->partner_bonus > 0) {
            $this->creditIncome($referrer, $user, 'partner', $package->partner_bonus, 1, $package->id);
        }
    }

    /**
     * Elevation Reward - 25% for Upgrade Packages.
     */
    protected function distributeElevationReward(User $user, Package $package)
    {
        $referrer = $user->referrer;
        if ($referrer && $package->elevation_reward > 0) {
            $this->creditIncome($referrer, $user, 'elevation', $package->elevation_reward, 1, $package->id);
        }
    }

    /**
     * Network Reward (Level Income) - 10 levels.
     */
    protected function distributeNetworkReward(User $user, Package $package)
    {
        if ($package->network_reward <= 0) return;

        $amountPerLevel = $package->network_reward / 10;
        
        $ancestors = ReferralTree::where('user_id', $user->id)
            ->where('distance', '<=', 10)
            ->orderBy('distance', 'asc')
            ->get();

        foreach ($ancestors as $treeItem) {
            $ancestor = $treeItem->ancestor;
            if ($ancestor) {
                $this->creditIncome($ancestor, $user, 'network', $amountPerLevel, $treeItem->distance, $package->id);
            }
        }
    }

    /**
     * Loop Income - Global Auto-Pool Matrix.
     */
    protected function distributeLoopIncome(User $user, Package $package)
    {
        // 1. Add user to the pool for this package
        $newPoolEntry = \App\Models\Pool::create([
            'user_id' => $user->id,
            'package_id' => $package->id,
            'level_paid' => 0
        ]);

        // 2. Check previous entries in the same package pool to see if they earned a level
        $poolTotalCount = \App\Models\Pool::where('package_id', $package->id)->count();
        $amountPerUnit = $package->loop_income / 10; // Total loop income is split across 10 matrix levels? 
        // Actually, PDF Page 13 says $0.37 is the base unit for $15 package levels.
        // $0.37 is approx 10% of $3.75. So yes, divide by 10.

        $previousEntries = \App\Models\Pool::where('package_id', $package->id)
            ->where('level_paid', '<', 10)
            ->where('id', '<', $newPoolEntry->id)
            ->get();

        foreach ($previousEntries as $entry) {
            $nextLevel = $entry->level_paid + 1;
            // Formula: User 'id' gets Level 'L' when total_count >= 2^L * id + (2^L - 1)
            // Wait, our IDs are auto-incrementing. Let's find their relative position in this package's pool.
            $position = \App\Models\Pool::where('package_id', $package->id)
                ->where('id', '<', $entry->id)
                ->count() + 1;

            $requiredCount = pow(2, $nextLevel) * $position + (pow(2, $nextLevel) - 1);

            if ($poolTotalCount >= $requiredCount) {
                // They earned Level payment
                // Amount = amountPerUnit * 2^nextLevel (as per the tables in PDF)
                $amount = $amountPerUnit * pow(2, $nextLevel - 1) * 2; // e.g. Level 1 = $0.75, Level 2 = $1.5
                
                $this->creditIncome($entry->user, $user, 'loop', $amount, $nextLevel, $package->id);
                $entry->increment('level_paid');
            }
        }
    }

    /**
     * Milestone Bonus - $25 for a completed 2x2 board (6 people).
     */
    protected function checkMilestoneBonus(User $user = null)
    {
        if (!$user) return;

        // Count total direct and indirect referrals (first 2 levels)
        $teamCount = ReferralTree::where('ancestor_id', $user->id)
            ->where('distance', '<=', 2)
            ->count();

        // Already paid milestones
        $paidCount = Income::where('user_id', $user->id)->where('type', 'milestone')->count();
        
        // Every 6 people = 1 Milestone
        $totalEligible = floor($teamCount / 6);
        
        if ($totalEligible > $paidCount) {
            for ($i = 0; $i < ($totalEligible - $paidCount); $i++) {
                $this->creditIncome($user, $user, 'milestone', 25.00);
            }
        }
    }

    /**
     * Credit income to a user and update their wallet.
     */
    protected function creditIncome(User $user, User $fromUser, $type, $amount, $level = null, $packageId = null)
    {
        if ($amount <= 0) return;

        // Record Income
        Income::create([
            'user_id' => $user->id,
            'from_user_id' => $fromUser->id == $user->id ? null : $fromUser->id,
            'type' => $type,
            'amount' => $amount,
            'level' => $level,
            'package_id' => $packageId
        ]);

        // Record Transaction
        Transaction::create([
            'user_id' => $user->id,
            'type' => 'credit',
            'category' => 'income',
            'amount' => $amount,
            'status' => 'completed',
            'description' => ucfirst($type) . " Income" . ($fromUser->id != $user->id ? " from " . $fromUser->username : "")
        ]);

        // Update Wallet
        $wallet = $user->wallet ?: Wallet::create(['user_id' => $user->id]);
        $wallet->increment('balance', $amount);
        $wallet->increment('total_earned', $amount);
    }
}
