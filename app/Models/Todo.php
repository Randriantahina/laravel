<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'title', 'description', 'completed'])]
class Todo extends Model
{
  protected function casts(): array
  {
    return [
      'completed' => 'boolean',
    ];
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
