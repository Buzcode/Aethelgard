<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  
    public function up(): void
    {
        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id(); // This is the auto-incrementing primary key
            
            // This sets up the foreign key to the users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->unsignedBigInteger('article_id');
            $table->string('article_type');
            $table->timestamps(); // Creates saved_at (as created_at) and updated_at columns

            // This ensures a user can't save the same item twice
            $table->unique(['user_id', 'article_id', 'article_type']);
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('saved_articles');
    }
};