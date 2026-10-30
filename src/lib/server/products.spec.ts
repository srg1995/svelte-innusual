import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { categories, getProduct, getReviews, listProducts } from './products';

// Las funciones simulan latencia con setTimeout: se controlan con temporizadores falsos
async function settle<T>(promise: Promise<T>, ms: number): Promise<T> {
	await vi.advanceTimersByTimeAsync(ms);
	return promise;
}

describe('products', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('expone las categorías', () => {
		expect(categories.map((c) => c.id)).toEqual(['ropa', 'accesorios']);
	});

	it('lista todo sin filtros', async () => {
		const all = await settle(listProducts({ q: '', category: '' }), 300);
		expect(all).toHaveLength(4);
	});

	it('filtra por categoría y por texto sin distinguir mayúsculas', async () => {
		const ropa = await settle(listProducts({ q: '', category: 'ropa' }), 300);
		expect(ropa.map((p) => p.name)).toEqual(['Camiseta', 'Sudadera']);

		const search = await settle(listProducts({ q: '  GORRA ', category: '' }), 300);
		expect(search.map((p) => p.name)).toEqual(['Gorra']);

		const none = await settle(listProducts({ q: 'gorra', category: 'ropa' }), 300);
		expect(none).toEqual([]);
	});

	it('busca un producto por id', async () => {
		expect((await settle(getProduct(3), 200))?.name).toBe('Gorra');
		expect(await settle(getProduct(999), 200)).toBeUndefined();
	});

	it('devuelve las reseñas con retraso, o una lista vacía', async () => {
		const reviews = getReviews(2);
		await vi.advanceTimersByTimeAsync(1999);
		let resolved = false;
		void reviews.then(() => (resolved = true));
		await Promise.resolve();
		expect(resolved).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		expect(await reviews).toHaveLength(2);

		expect(await settle(getReviews(3), 2000)).toEqual([]);
		expect(await settle(getReviews(999), 2000)).toEqual([]);
	});
});
