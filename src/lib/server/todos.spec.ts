import { beforeEach, describe, expect, it, vi } from 'vitest';

// El almacén vive en una variable de módulo: se recarga el módulo en cada test para aislarlos
async function loadStore() {
	vi.resetModules();
	return import('./todos');
}

describe('todos', () => {
	let store: Awaited<ReturnType<typeof loadStore>>;

	beforeEach(async () => {
		store = await loadStore();
	});

	it('lista todas las tareas y filtra por estado', () => {
		expect(store.listTodos()).toHaveLength(3);
		expect(store.listTodos(true).map((t) => t.id)).toEqual([1]);
		expect(store.listTodos(false).map((t) => t.id)).toEqual([2, 3]);
	});

	it('busca una tarea por id', () => {
		expect(store.getTodo(2)?.text).toBe('Validar el body del POST');
		expect(store.getTodo(999)).toBeUndefined();
	});

	it('crea tareas con ids correlativos y sin completar', () => {
		const todo = store.createTodo('Nueva');
		expect(todo).toEqual({ id: 4, text: 'Nueva', done: false });
		expect(store.createTodo('Otra').id).toBe(5);
		expect(store.listTodos()).toHaveLength(5);
	});

	it('actualiza una tarea existente y devuelve undefined si no existe', () => {
		expect(store.updateTodo(2, { done: true })).toMatchObject({ id: 2, done: true });
		expect(store.getTodo(2)?.done).toBe(true);
		expect(store.updateTodo(999, { done: true })).toBeUndefined();
	});

	it('borra una tarea y avisa si no existía', () => {
		expect(store.deleteTodo(1)).toBe(true);
		expect(store.getTodo(1)).toBeUndefined();
		expect(store.deleteTodo(1)).toBe(false);
	});
});
