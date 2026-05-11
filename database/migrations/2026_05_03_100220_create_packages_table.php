<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('upgrade'); // 'joining' or 'upgrade'
            $table->decimal('price', 12, 2);
            $table->decimal('partner_bonus', 12, 2)->default(0);
            $table->decimal('elevation_reward', 12, 2)->default(0);
            $table->decimal('network_reward', 12, 2)->default(0);
            $table->decimal('loop_income', 12, 2)->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
