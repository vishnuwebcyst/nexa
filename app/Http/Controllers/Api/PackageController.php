<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    protected $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index()
    {
        return response()->json(Package::where('status', true)->get());
    }

    public function purchase(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'tx_hash' => 'required|string'
        ]);

        $package = Package::findOrFail($request->package_id);
        $user = $request->user();

        // In real app, verify Web3 transaction here
        
        $userPackage = $this->packageService->purchase($user, $package, $request->tx_hash);

        return response()->json([
            'message' => 'Package purchased successfully',
            'user_package' => $userPackage
        ]);
    }
}
