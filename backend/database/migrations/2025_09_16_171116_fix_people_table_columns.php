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
            // Action 1: Add the missing 'category' column after 'bio'
            $table->string('category')->after('bio');

            // Action 2: Rename the 'portrait_url' column to 'picture' for consistency
            $table->renameColumn('portrait_url', 'picture');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('people', function (Blueprint $table) {
            // This allows you to undo the changes if needed
            $table->renameColumn('picture', 'portrait_url');
            $table->dropColumn('category');
        });
    }
};