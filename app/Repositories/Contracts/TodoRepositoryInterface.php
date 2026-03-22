<?php

namespace App\Repositories\Contracts;

use App\DTOs\TodoDTO;
use App\Models\Todo;
use Illuminate\Database\Eloquent\Collection;

interface TodoRepositoryInterface
{
  public function allForUser(int $userId): Collection;

  public function findForUser(int $id, int $userId): Todo;

  public function create(int $userId, TodoDTO $dto): Todo;

  public function update(Todo $todo, TodoDTO $dto): Todo;

  public function delete(Todo $todo): void;
}
