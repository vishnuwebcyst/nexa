<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use kornrunner\Keccak;


class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'referral_code' => 'nullable|exists:users,referral_code',
            'wallet_address' => 'required|string|unique:users,wallet_address'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify Signature for Registration
        if (!$request->signature || !$this->verifySignature(null, $request->signature, $request->wallet_address)) {
            return response()->json(['message' => 'Signature verification failed. You must sign the message to register.'], 401);
        }

        $user = $this->authService->register($request->all());
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function getNonce(Request $request)
    {
        $request->validate(['wallet_address' => 'required']);
        
        $user = User::where('wallet_address', $request->wallet_address)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Wallet not registered. Please sign up first.'], 404);
        }

        $nonce = Str::random(16);
        $user->update(['nonce' => $nonce]);

        return response()->json(['nonce' => $nonce]);
    }

    public function loginWithWallet(Request $request)
    {
        $request->validate([
            'wallet_address' => 'required',
            'signature' => 'required',
        ]);

        $user = User::where('wallet_address', $request->wallet_address)->first();

        if (!$user || !$user->nonce) {
            return response()->json(['message' => 'Invalid request or user not found.'], 400);
        }

        // Verify Signature
        if (!$this->verifySignature($user->nonce, $request->signature, $request->wallet_address)) {
            return response()->json(['message' => 'Signature verification failed.'], 401);
        }

        // Clear nonce after successful login
        $user->update(['nonce' => null]);

        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    protected function verifySignature($nonce, $signature, $address)
    {
        $message = "Login to Nexa with nonce: " . $nonce;
        // If registration, use registration message
        if (request()->is('api/register')) {
            $message = "Registering on Nexa with wallet: " . $address;
        }

        $msgLength = strlen($message);
        $hash = Keccak::hash("\x19Ethereum Signed Message:\n{$msgLength}{$message}", 256);
        
        $sign = [
            'r' => substr($signature, 2, 64),
            's' => substr($signature, 66, 64),
        ];
        
        $recId = ord(hex2bin(substr($signature, 130, 2))) - 27;

        if ($recId != 0 && $recId != 1) {
            return false;
        }

        $ec = new \Elliptic\EC('secp256k1');
        $pubKey = $ec->recoverPubKey($hash, $sign, $recId);
        $recoveredAddress = "0x" . substr(Keccak::hash(substr(hex2bin($pubKey->encode('hex')), 1), 256), 24);

        return strtolower($recoveredAddress) === strtolower($address);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('wallet', 'activePackage.package'));
    }
}
