<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRecommendation extends Model
{
    // Inside the UserRecommendation class
protected $guarded = []; // Allow mass assignment for simplicity here

public function recommendable()
{
    return $this->morphTo();
}
}
