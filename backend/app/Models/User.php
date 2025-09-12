<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
    'role', // <-- ADD THIS LINE
]; 
/**
 * Get the user's full name.
 *
 * @return \Illuminate\Database\Eloquent\Casts\Attribute
 */
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
}