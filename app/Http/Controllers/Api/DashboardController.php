<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $stats = [
            'balance' => $user->wallet->balance,
            'total_earned' => $user->wallet->total_earned,
            'total_referrals' => $user->referrals()->count(),
            'active_package' => $user->activePackage?->package->name ?? 'None',
        ];

        $incomeByType = Income::where('user_id', $user->id)
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->get();

        $recentTransactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'income_by_type' => $incomeByType,
            'recent_transactions' => $recentTransactions
        ]);
    }
}
