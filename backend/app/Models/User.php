<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// --- ADD THESE THREE LINES ---
use App\Models\Person;
use App\Models\Event;
use App\Models\Place;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
    ];

    /**
     * Get the user's full name.
     */
    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['name'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | LIKE RELATIONSHIPS
    |--------------------------------------------------------------------------
    |
    | These methods define the many-to-many relationships between a user
    | and the content they can like.
    |
    */

    /**
     * The people that the user has liked.
     */
    public function likedPeople()
    {
        return $this->belongsToMany(Person::class, 'person_likes', 'user_id', 'person_id');
    }

    /**
     * The events that the user has liked.
     */
    public function likedEvents()
    {
        return $this->belongsToMany(Event::class, 'event_likes', 'user_id', 'event_id');
    }

    /**
     * The places that the user has liked.
     */
    public function likedPlaces()
    {
        return $this->belongsToMany(Place::class, 'place_likes', 'user_id', 'place_id');
    }
}