<?php

namespace App\Services;

use App\Models\User;
use App\Models\Package;
use App\Models\UserPackage;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class PackageService
{
    protected $incomeService;

    public function __construct(IncomeService $incomeService)
    {
        $this->incomeService = $incomeService;
    }

    public function purchase(User $user, Package $package, $txHash = null)
    {
        return DB::transaction(function () use ($user, $package, $txHash) {
            // Check if user already has an active package (for upgrade logic)
            $activePackage = $user->activePackage;
            
            if ($activePackage) {
                $activePackage->update(['status' => 'upgraded']);
            }

            // Create UserPackage
            $userPackage = UserPackage::create([
                'user_id' => $user->id,
                'package_id' => $package->id,
                'status' => 'active',
                'purchased_at' => now()
            ]);

            // Record Transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'category' => 'purchase',
                'amount' => $package->price,
                'status' => 'completed',
                'description' => $txHash ? "Hash: " . $txHash : "Purchased " . $package->name
            ]);

            // Distribute Income
            $this->incomeService->distribute($user, $package);

            return $userPackage;
        });
    }
}
