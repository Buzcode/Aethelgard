<?php                                                                                                                                       

namespace App\Models;                                                                                                                             

use Illuminate\Database\Eloquent\Model;                                                                                                        
                                                                                                                                                  
class Place extends Model                                                                                                                          
{                                                                                                                                           
    
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'description',                                                                                                                     
        'picture',
        'category',
        'likes'
    ];  
    public function likers()
{
    return $this->belongsToMany(User::class, 'event_likes', 'event_id', 'user_id');
}                                                                                                                         
}                                                                                                                                                   
                        
                                                                                                                                             
                                                                                                                                                