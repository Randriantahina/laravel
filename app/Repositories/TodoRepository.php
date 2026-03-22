<?php

namespace App\Repositories;

use App\DTOs\TodoDTO;
use App\Models\Todo;
use App\Repositories\Contracts\TodoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TodoRepository implements TodoRepositoryInterface
{
  public function allForUser(int $userId): Collection
  {
    return Todo::where('user_id', $userId)
      ->latest()
      ->get();
  }

  public function findForUser(int $id, int $userId): Todo
  {
    return Todo::where('id', $id)
      ->where('user_id', $userId)
      ->firstOrFail();
  }

  public function create(int $userId, TodoDTO $dto): Todo
  {
    return Todo::create([
      'user_id'     => $userId,
      'title'       => $dto->title,
      'description' => $dto->description,
      'completed'   => $dto->completed,
    ]);
  }

  public function update(Todo $todo, TodoDTO $dto): Todo
  {
    $todo->update([
      'title'       => $dto->title,
      'description' => $dto->description,
      'completed'   => $dto->completed,
    ]);

    return $todo->refresh();
  }

  public function delete(Todo $todo): void
  {
    $todo->delete();
  }
}
