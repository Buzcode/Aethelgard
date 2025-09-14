<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonLikesTable extends Migration
{
    public function up(): void
    {
        Schema::create('person_likes', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('person_id')->constrained()->onDelete('cascade'); // Changed
            $table->primary(['user_id', 'person_id']); // Changed
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('person_likes');
    }
}