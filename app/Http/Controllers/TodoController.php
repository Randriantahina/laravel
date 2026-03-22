<?php

namespace App\Http\Controllers;

use App\DTOs\TodoDTO;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Services\TodoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
  public function __construct(
    private readonly TodoService $service,
  ) {}

  public function index(Request $request): Response
  {
    $todos = $this->service->listForUser($request->user()->id);

    return Inertia::render('todos/index', [
      'todos' => TodoResource::collection($todos)->resolve(),
    ]);
  }

  public function store(StoreTodoRequest $request): RedirectResponse
  {
    $this->service->create(
      $request->user()->id,
      TodoDTO::fromArray($request->validated()),
    );

    return back();
  }

  public function update(UpdateTodoRequest $request, int $id): RedirectResponse
  {
    $this->service->update(
      $id,
      $request->user()->id,
      TodoDTO::fromArray($request->validated()),
    );

    return back();
  }

  public function toggle(Request $request, int $id): RedirectResponse
  {
    $this->service->toggle($id, $request->user()->id);

    return back();
  }

  public function destroy(Request $request, int $id): RedirectResponse
  {
    $this->service->delete($id, $request->user()->id);

    return back();
  }
}
