<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Nexa Excess',
                'type' => 'joining',
                'price' => 15,
                'partner_bonus' => 7.5,
                'elevation_reward' => 0,
                'network_reward' => 3.75,
                'loop_income' => 3.75,
                'status' => true,
            ],
            [
                'name' => 'Nexa Elevate',
                'type' => 'upgrade',
                'price' => 45,
                'partner_bonus' => 0,
                'elevation_reward' => 11.25,
                'network_reward' => 16.87,
                'loop_income' => 16.87,
                'status' => true,
            ],
            [
                'name' => 'Nexa Apex',
                'type' => 'upgrade',
                'price' => 135,
                'partner_bonus' => 0,
                'elevation_reward' => 33.75,
                'network_reward' => 50.62,
                'loop_income' => 50.62,
                'status' => true,
            ],
            [
                'name' => 'Nexa Zenith',
                'type' => 'upgrade',
                'price' => 405,
                'partner_bonus' => 0,
                'elevation_reward' => 101.25,
                'network_reward' => 151.87,
                'loop_income' => 151.87,
                'status' => true,
            ],
            [
                'name' => 'Nexa Omega',
                'type' => 'upgrade',
                'price' => 1215,
                'partner_bonus' => 0,
                'elevation_reward' => 303.75,
                'network_reward' => 455.62,
                'loop_income' => 455.62,
                'status' => true,
            ],
            [
                'name' => 'Nexa Legacy Club',
                'type' => 'upgrade',
                'price' => 3645,
                'partner_bonus' => 0,
                'elevation_reward' => 911.25,
                'network_reward' => 1366.87,
                'loop_income' => 1366.87,
                'status' => true,
            ],
        ];

        foreach ($packages as $package) {
            Package::updateOrCreate(['name' => $package['name']], $package);
        }
    }
}
