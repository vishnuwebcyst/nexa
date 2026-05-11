<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10',
            'wallet_address' => 'required|string'
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if ($wallet->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance'], 422);
        }

        // 2 sponsors rule check
        $directReferrals = $user->referrals()->count();
        if ($directReferrals < 2) {
            return response()->json(['message' => 'Minimum 2 direct sponsors required to unlock withdrawal'], 422);
        }

        return DB::transaction(function () use ($user, $wallet, $request) {
            $amount = $request->amount;
            $fee = $amount * 0.10;
            $netAmount = $amount - $fee;

            $withdrawal = Withdrawal::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'fee' => $fee,
                'net_amount' => $netAmount,
                'status' => 'pending',
                'wallet_address' => $request->wallet_address
            ]);

            // Deduct from wallet
            $wallet->decrement('balance', $amount);
            $wallet->increment('total_withdrawn', $amount);

            // Record transaction
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'category' => 'withdrawal',
                'amount' => $amount,
                'status' => 'pending',
                'description' => "Withdrawal request for $" . $amount
            ]);

            return response()->json([
                'message' => 'Withdrawal request submitted successfully',
                'withdrawal' => $withdrawal
            ]);
        });
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'tx_hash' => 'required|string|unique:transactions,description' // simplistic tx_hash check
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        return DB::transaction(function () use ($user, $wallet, $request) {
            $wallet->increment('balance', $request->amount);

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'credit',
                'category' => 'deposit',
                'amount' => $request->amount,
                'status' => 'completed',
                'description' => $request->tx_hash
            ]);

            return response()->json([
                'message' => 'Deposit recorded successfully',
                'transaction' => $transaction
            ]);
        });
    }

    public function history(Request $request)
    {
        return response()->json(Transaction::where('user_id', $request->user()->id)->latest()->get());
    }

    public function getSettings()
    {
        return response()->json([
            'admin_wallet' => \App\Models\Setting::where('key', 'admin_wallet')->value('value'),
            'usdt_contract' => \App\Models\Setting::where('key', 'usdt_contract')->value('value'),
        ]);
    }
}
