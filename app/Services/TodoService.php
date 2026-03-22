<?php

namespace App\Services;

use App\DTOs\TodoDTO;
use App\Models\Todo;
use App\Repositories\Contracts\TodoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class TodoService
{
  public function __construct(
    private readonly TodoRepositoryInterface $repository,
  ) {}

  public function listForUser(int $userId): Collection
  {
    return $this->repository->allForUser($userId);
  }

  public function findForUser(int $id, int $userId): Todo
  {
    return $this->repository->findForUser($id, $userId);
  }

  public function create(int $userId, TodoDTO $dto): Todo
  {
    return $this->repository->create($userId, $dto);
  }

  public function update(int $id, int $userId, TodoDTO $dto): Todo
  {
    $todo = $this->repository->findForUser($id, $userId);

    return $this->repository->update($todo, $dto);
  }

  public function delete(int $id, int $userId): void
  {
    $todo = $this->repository->findForUser($id, $userId);
    $this->repository->delete($todo);
  }

  public function toggle(int $id, int $userId): Todo
  {
    $todo = $this->repository->findForUser($id, $userId);

    return $this->repository->update($todo, new TodoDTO(
      title: $todo->title,
      description: $todo->description,
      completed: ! $todo->completed,
    ));
  }
}
