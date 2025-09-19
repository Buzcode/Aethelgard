<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\UserRecommendation; // Correctly imported for the relationship
use Illuminate\Database\Eloquent\Relations\HasMany; // Correctly imported

class User extends Authenticatable
{
    /**
     * The traits that should be used.
     */
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

    /*
    |--------------------------------------------------------------------------
    | SAVE RELATIONSHIP --- (THIS IS THE FIX) ---
    |--------------------------------------------------------------------------
    */

    /**
     * Get all of the articles saved by the user.
     */
    public function savedArticles(): HasMany
    {
        return $this->hasMany(SavedArticle::class);
    }

    /*
    |--------------------------------------------------------------------------
    | RECOMMENDATION RELATIONSHIP
    |--------------------------------------------------------------------------
    */

    /**
     * Get the pre-calculated recommendations for the user.
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(UserRecommendation::class);
    }
}