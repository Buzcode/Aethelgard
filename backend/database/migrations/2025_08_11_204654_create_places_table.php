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
        Schema::create('places', function (Blueprint $table) {                                                                            
        $table->id();                                                                                                                                                                                                       
        $table->string('name');                                                                                                                    
        $table->decimal('latitude', 10, 8); // Precision 10, 8 digits after decimal                                                                                                                   
        $table->decimal('longitude', 11, 8); // Precision 11, 8 digits after decimal                                                                                                                   
        $table->text('description')->nullable();                                                                                                                                                       
        $table->string('picture')->nullable(); // For the image path
        $table->timestamps();                                                                                                                                                                                                    
        });                                                                           
    }

    /**                                                                                                 
     * Reverse the migrations.                                                                                                                                                                                                                                                                       
     */
    public function down(): void                                                                                                                                                                                                                                                                                                                                                                                      
    {
        Schema::dropIfExists('places');                                                                                                                                                                                                                                                                                                                                                             
    }                                                                                                                                           
};
                                                                                                                                             