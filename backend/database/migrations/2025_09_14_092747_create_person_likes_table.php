<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
     /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('person_likes', function (Blueprint $table) {
            // Column for the user ID. Must be an unsigned big integer to match the default 'id' column in the 'users' table.
            $table->unsignedBigInteger('user_id');

            // Column for the person ID.
            $table->unsignedBigInteger('person_id');

            // Set up the foreign key constraints.
            // This links 'user_id' to the 'id' column on the 'users' table.
            // 'onDelete('cascade')' means if a user is deleted, all their likes are also deleted automatically.
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // This links 'person_id' to the 'id' column on the 'people' table.
            $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');

            // Define a composite primary key.
            // This is the crucial part that prevents a user from liking the same person more than once.
            $table->primary(['user_id', 'person_id']);
            
            // Optional: Adds 'created_at' and 'updated_at' columns to track when the like was made.
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
   public function down(): void
    {
        Schema::dropIfExists('person_likes');
    }
};
