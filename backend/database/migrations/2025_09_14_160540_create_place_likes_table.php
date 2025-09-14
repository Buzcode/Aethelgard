<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlaceLikesTable extends Migration
{
    public function up(): void
    {
        Schema::create('place_likes', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('place_id')->constrained()->onDelete('cascade'); // Changed
            $table->primary(['user_id', 'place_id']); // Changed
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('place_likes');
    }
}