<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

// --- These imports are correct ---
use App\Models\Person;
use App\Models\Event;
use App\Models\Place;

class User extends Authenticatable
{
    // The HasApiTokens trait is correctly included here.
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['name'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     * We are using the property format for maximum compatibility.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's full name using an accessor.
     * This is automatically called because 'name' is in the $appends array.
     */
    public function getNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /*
    |--------------------------------------------------------------------------
    | LIKE RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * The people that the user has liked.
     */
    public function likedPeople(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'person_likes', 'user_id', 'person_id');
    }

    /**
     * The events that the user has liked.
     */
    public function likedEvents(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_likes', 'user_id', 'event_id');
    }

    /**
     * The places that the user has liked.
     */
    public function likedPlaces(): BelongsToMany
    {
        return $this->belongsToMany(Place::class, 'place_likes', 'user_id', 'place_id');
    }
}