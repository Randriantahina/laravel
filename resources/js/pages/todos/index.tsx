import { useState } from 'react';
import { Form, Head, router } from '@inertiajs/react';
import TodoController from '@/actions/App/Http/Controllers/TodoController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/todos';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Todos', href: index() }];

interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

function CreateTodoDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ New Todo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Todo</DialogTitle>
                </DialogHeader>
                <Form
                    {...TodoController.store.form()}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="What needs to be done?"
                                    autoFocus
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Optional details…"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating…' : 'Create'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditTodoDialog({ todo }: { todo: Todo }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Todo</DialogTitle>
                </DialogHeader>
                <Form
                    {...TodoController.update.form(todo.id)}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`title-${todo.id}`}>
                                    Title
                                </Label>
                                <Input
                                    id={`title-${todo.id}`}
                                    name="title"
                                    defaultValue={todo.title}
                                />
                                <InputError message={errors.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`description-${todo.id}`}>
                                    Description
                                </Label>
                                <Textarea
                                    id={`description-${todo.id}`}
                                    name="description"
                                    defaultValue={todo.description ?? ''}
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Save'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function TodoItem({ todo }: { todo: Todo }) {
    const [toggling, setToggling] = useState(false);

    function handleToggle() {
        setToggling(true);
        router.patch(
            TodoController.toggle.url(todo.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setToggling(false),
            },
        );
    }

    return (
        <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <Checkbox
                checked={todo.completed}
                disabled={toggling}
                onCheckedChange={handleToggle}
                className="mt-0.5"
                aria-label="Toggle completed"
            />

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`truncate text-sm font-medium ${
                            todo.completed
                                ? 'text-muted-foreground line-through'
                                : ''
                        }`}
                    >
                        {todo.title}
                    </span>
                    {todo.completed && (
                        <Badge variant="secondary" className="shrink-0">
                            Done
                        </Badge>
                    )}
                </div>
                {todo.description && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {todo.description}
                    </p>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <EditTodoDialog todo={todo} />
                <Form
                    {...TodoController.destroy.form(todo.id)}
                    options={{ preserveScroll: true }}
                >
                    {({ processing }) => (
                        <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            disabled={processing}
                            className="text-destructive hover:text-destructive"
                        >
                            Delete
                        </Button>
                    )}
                </Form>
            </div>
        </div>
    );
}

export default function Todos({ todos }: { todos: Todo[] }) {
    const pending = todos.filter((t) => !t.completed);
    const completed = todos.filter((t) => t.completed);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todos" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Todos</h1>
                        <p className="text-sm text-muted-foreground">
                            {pending.length} remaining · {completed.length}{' '}
                            completed
                        </p>
                    </div>
                    <CreateTodoDialog />
                </div>

                {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">
                            No todos yet.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Create one to get started!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {pending.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                        {completed.length > 0 && pending.length > 0 && (
                            <div className="my-2 flex items-center gap-2">
                                <div className="h-px flex-1 bg-border" />
                                <span className="text-xs text-muted-foreground">
                                    Completed
                                </span>
                                <div className="h-px flex-1 bg-border" />
                            </div>
                        )}
                        {completed.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
