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
        Schema::create('people', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->string('name');
            $table->string('birth_date')->nullable(); // Nullable because exact dates may be unknown
            $table->string('death_date')->nullable(); // Nullable for the same reason
            $table->text('bio')->nullable(); // A longer text field for the biography
            $table->string('portrait_url')->nullable(); // A URL to an image
            $table->timestamps(); // Creates `created_at` and `updated_at` columns
        });
    } 

    /**
     * Reverse the migrations. 
     */ 
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
