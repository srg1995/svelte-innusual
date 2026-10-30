import type { Todo } from '#lib/todo.js';

// Almacén en memoria solo para la demo: se reinicia con el servidor y se comparte entre peticiones.
let nextId = 4;
let todos: Todo[] = [
	{ id: 1, text: 'Crear el endpoint GET', done: true },
	{ id: 2, text: 'Validar el body del POST', done: false },
	{ id: 3, text: 'Probarlo con fetch', done: false }
];

export const listTodos = (done?: boolean) =>
	done === undefined ? todos : todos.filter((t) => t.done === done);

export const getTodo = (id: number) => todos.find((t) => t.id === id);

export function createTodo(text: string): Todo {
	const todo: Todo = { id: nextId++, text, done: false };
	todos = [...todos, todo];
	return todo;
}

export function updateTodo(id: number, changes: Partial<Omit<Todo, 'id'>>): Todo | undefined {
	const todo = getTodo(id);
	if (todo) Object.assign(todo, changes);
	return todo;
}

export function deleteTodo(id: number): boolean {
	const before = todos.length;
	todos = todos.filter((t) => t.id !== id);
	return todos.length < before;
}
