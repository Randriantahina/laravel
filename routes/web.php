<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('todos')->name('todos.')->group(function () {
        Route::get('/', [TodoController::class, 'index'])->name('index');
        Route::post('/', [TodoController::class, 'store'])->name('store');
        Route::put('{id}', [TodoController::class, 'update'])->name('update');
        Route::patch('{id}/toggle', [TodoController::class, 'toggle'])->name('toggle');
        Route::delete('{id}', [TodoController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
