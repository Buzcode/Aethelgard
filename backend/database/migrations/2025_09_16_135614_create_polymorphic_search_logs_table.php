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
        Schema::create('search_logs', function (Blueprint $table) {
            $table->id();
            $table->string('search_term');
            
            // This is the polymorphic relationship.
            // It creates two columns: `loggable_id` (a BigInt) and
            // `loggable_type` (a Varchar to store the model name, e.g., 'App\Models\Person').
            $table->morphs('loggable');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('polymorphic_search_logs');
    }
};
