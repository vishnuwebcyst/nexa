<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'admin_wallet',
                'value' => '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Default dev wallet
            ],
            [
                'key' => 'usdt_contract',
                'value' => '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // Mock USDT on BSC Testnet
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
