<?php

namespace App\DTOs;

readonly class TodoDTO
{
  public function __construct(
    public string $title,
    public ?string $description,
    public bool $completed = false,
  ) {}

  public static function fromArray(array $data): self
  {
    return new self(
      title: $data['title'],
      description: $data['description'] ?? null,
      completed: $data['completed'] ?? false,
    );
  }
}
