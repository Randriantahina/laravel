<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'title'       => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string', 'max:1000'],
      'completed'   => ['sometimes', 'boolean'],
    ];
  }
}
