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
        Schema::table('people', function (Blueprint $table) {
            // Add a column to store the total number of likes
            $table->integer('likes')->unsigned()->default(0)->after('category');
        });

        Schema::table('places', function (Blueprint $table) {
            // Add the same column to the places table
            $table->integer('likes')->unsigned()->default(0)->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
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
    }
};
