<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('people', function (Blueprint $table) {
            // Add a column to store the total number of likes.
            $table->integer('likes')->unsigned()->default(0);
        });

        Schema::table('places', function (Blueprint $table) {
            // Add the same column to the places table.
            $table->integer('likes')->unsigned()->default(0);
        });

        // --- FIX: ADD THIS NEW SECTION ---
        Schema::table('events', function (Blueprint $table) {
            // Add the same column to the events table.
            $table->integer('likes')->unsigned()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('people', function (Blueprint $table) {
            $table->dropColumn('likes');
        });

        Schema::table('places', function (Blueprint $table) {
            $table->dropColumn('likes');
        });

        // --- FIX: ADD THIS NEW SECTION ---
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('likes');
        });
    }
};