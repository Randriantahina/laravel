# Laravel Todo App

Application full-stack Todo construite avec **Laravel 13**, **Inertia.js** et **React 19** (TypeScript), suivant les principes de la **Clean Architecture**.

## Stack technique

| Couche    | Technologie                     |
| --------- | ------------------------------- |
| Backend   | Laravel 13, PHP 8.3             |
| Auth      | Laravel Fortify (2FA inclus)    |
| Frontend  | React 19, TypeScript, Vite 8    |
| Bridge    | Inertia.js                      |
| UI        | Tailwind CSS, shadcn/ui, Lucide |
| Routes TS | Laravel Wayfinder               |

---

## Architecture

Le projet respecte la séparation des responsabilités en Clean Architecture :

```
app/
├── DTOs/
│   └── TodoDTO.php               # Objet de transfert de données (readonly)
├── Models/
│   └── Todo.php                  # Modèle Eloquent avec attributs PHP 8+
├── Repositories/
│   ├── Contracts/
│   │   └── TodoRepositoryInterface.php   # Contrat d'abstraction
│   └── TodoRepository.php        # Implémentation Eloquent
├── Services/
│   └── TodoService.php           # Logique métier
└── Http/
    ├── Controllers/
    │   └── TodoController.php    # Contrôleur Inertia
    ├── Requests/
    │   ├── StoreTodoRequest.php  # Validation création
    │   └── UpdateTodoRequest.php # Validation mise à jour
    └── Resources/
        └── TodoResource.php      # Sérialisation JSON
```

### Flux de données

```
Request → FormRequest (validation)
        → Controller (#[CurrentUser], #[RouteParameter])
        → Service (logique métier)
        → Repository (accès données)
        → Model (Eloquent)
        → Resource (sérialisation)
        → Inertia::render → React
```

---

## Attributs PHP Laravel 13

Ce projet exploite les **PHP Attributes** natifs de Laravel 13 pour réduire le boilerplate :

### Modèle

```php
#[Fillable(['user_id', 'title', 'description', 'completed'])]
#[UseFactory(TodoFactory::class)]   // lie la factory automatiquement
#[UseResource(TodoResource::class)] // lie la resource API
class Todo extends Model
{
    #[Scope]
    protected function completed(Builder $query): void { ... }

    #[Scope]
    protected function pending(Builder $query): void { ... }
}
```

### Contrôleur

```php
// Injection du user authentifié sans $request->user()
public function index(#[CurrentUser] User $user): Response

// Injection du paramètre de route sans type-hint de modèle
public function destroy(
    #[RouteParameter('id')] int $id,
    #[CurrentUser] User $user,
): RedirectResponse
```

### FormRequests

```php
#[StopOnFirstFailure]  // arrête à la première erreur de validation
class StoreTodoRequest extends FormRequest
```

### Routes

```php
// Route::controller() évite de répéter la classe
Route::controller(TodoController::class)->prefix('todos')->name('todos.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::put('{id}', 'update')->name('update');
    Route::patch('{id}/toggle', 'toggle')->name('toggle');
    Route::delete('{id}', 'destroy')->name('destroy');
});
```

---

## API Todo

Toutes les routes sont protégées par les middlewares `auth` et `verified`.

| Méthode  | URL                  | Action                                |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/todos`             | Liste tous les todos de l'utilisateur |
| `POST`   | `/todos`             | Crée un nouveau todo                  |
| `PUT`    | `/todos/{id}`        | Met à jour un todo                    |
| `PATCH`  | `/todos/{id}/toggle` | Bascule l'état completed              |
| `DELETE` | `/todos/{id}`        | Supprime un todo                      |

---

## Installation

### Prérequis

- PHP 8.3+
- Composer
- Node.js 20+ / pnpm
- Base de données (SQLite, MySQL, PostgreSQL)

### Étapes

```bash
# 1. Cloner le dépôt
git clone <repo-url>
cd laravel

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JS
pnpm install

# 4. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 5. Configurer la base de données dans .env
# DB_CONNECTION=sqlite  (ou mysql/pgsql)

# 6. Exécuter les migrations
php artisan migrate

# 7. Lancer les serveurs de développement
composer run dev
```

> `composer run dev` démarre Laravel et Vite simultanément.

---

## Frontend

L'interface est construite avec le **React starter kit** de Laravel et utilise **Wayfinder** pour avoir les routes typées automatiquement générées.

```
resources/js/
├── pages/
│   └── todos/
│       └── index.tsx         # Page principale Todo (liste, création, édition)
├── actions/
│   └── App/Http/Controllers/
│       └── TodoController.ts # Routes typées auto-générées par Wayfinder
├── routes/
│   └── todos/
│       └── index.ts          # Helpers d'URL typés
└── components/
    └── ui/                   # Composants shadcn/ui
```

### Fonctionnalités UI

- ✅ Créer un todo (dialog modal)
- ✅ Modifier un todo (dialog modal)
- ✅ Cocher/décocher la complétion (checkbox optimiste)
- ✅ Supprimer un todo
- ✅ Séparation visuelle tâches en cours / terminées
- ✅ Navigation sidebar avec lien Todos

### Régénérer les routes Wayfinder

Si vous ajoutez de nouvelles routes, régénérez les types :

```bash
php artisan wayfinder:generate
```

---

## Tests

```bash
# Tous les tests
php artisan test

# Avec couverture de code
php artisan test --coverage
```

---

## Qualité de code

```bash
# Linter PHP (Laravel Pint)
./vendor/bin/pint

# Linter JS/TS (ESLint)
pnpm lint
```
