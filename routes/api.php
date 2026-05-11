<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\PoolController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/get-nonce', [AuthController::class, 'getNonce']);
Route::post('/login-with-wallet', [AuthController::class, 'loginWithWallet']);


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    Route::get('/packages', [PackageController::class, 'index']);
    Route::post('/packages/purchase', [PackageController::class, 'purchase']);

    Route::get('/wallet/web3-settings', [WalletController::class, 'getSettings']);
    Route::get('/wallet/history', [WalletController::class, 'history']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);


    Route::get('/referrals/tree', [ReferralController::class, 'tree']);
    Route::get('/pools', [PoolController::class, 'index']);
});
