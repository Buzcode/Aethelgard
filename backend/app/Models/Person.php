<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
   use HasFactory;

    // The table associated with the model.
    protected $table = 'people'; // Explicitly defining the table name is good practice

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'birth_date',
        'death_date',
        'bio',
        'portrait_url',
        'category',
        'likes' // This is correct
    ];
    // In Person.php

/**
 * The users that have liked this person.
 */
public function likers()
{
    return $this->belongsToMany(User::class, 'person_likes', 'person_id', 'user_id');
}
}