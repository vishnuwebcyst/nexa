<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pool;
use App\Models\Package;
use Illuminate\Http\Request;

class PoolController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $pools = Pool::where('user_id', $user->id)
            ->with('package')
            ->get()
            ->map(function ($pool) {
                // Calculate next level requirements
                $nextLevel = $pool->level_paid + 1;
                
                // Position in pool for this package
                $position = Pool::where('package_id', $pool->package_id)
                    ->where('id', '<', $pool->id)
                    ->count() + 1;

                $requiredCount = pow(2, $nextLevel) * $position + (pow(2, $nextLevel) - 1);
                $currentTotal = Pool::where('package_id', $pool->package_id)->count();
                
                return [
                    'id' => $pool->id,
                    'package_name' => $pool->package->name,
                    'current_level' => $pool->level_paid,
                    'next_level' => $nextLevel > 10 ? null : $nextLevel,
                    'required_joins' => $requiredCount,
                    'current_joins' => $currentTotal,
                    'progress' => min(100, ($currentTotal / $requiredCount) * 100),
                    'remaining' => max(0, $requiredCount - $currentTotal),
                ];
            });

        return response()->json([
            'pools' => $pools
        ]);
    }
}
