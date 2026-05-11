<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_tree', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ancestor_id')->constrained('users')->onDelete('cascade');
            $table->integer('distance');
            $table->timestamps();

            $table->unique(['user_id', 'ancestor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_tree');
    }
};
