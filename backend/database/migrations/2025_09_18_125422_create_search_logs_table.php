php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('search_logs', function (Blueprint $table) {
            // This modifies the 'search_term' column to allow NULL values.
            $table->string('search_term')->nullable()->change();
        });
    }

   
    public function down(): void
    {
        Schema::table('search_logs', function (Blueprint $table) {
            // This reverts the change if you ever need to undo the migration.
            $table->string('search_term')->nullable(false)->change();
        });
    }
};