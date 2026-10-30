import { beforeEach, describe, expect, it } from 'vitest';
import { cart } from './cart.svelte.js';

describe('cart', () => {
	beforeEach(() => cart.clear());

	it('empieza vacío', () => {
		expect(cart.items).toEqual([]);
		expect(cart.count).toBe(0);
		expect(cart.total).toBe(0);
	});

	it('añade productos y calcula cantidad y total', () => {
		cart.add('Camiseta', 15);
		cart.add('Gorra', 10);
		expect(cart.items).toHaveLength(2);
		expect(cart.count).toBe(2);
		expect(cart.total).toBe(25);
	});

	it('incrementa la cantidad si el producto ya estaba', () => {
		cart.add('Camiseta', 15);
		cart.add('Camiseta', 15);
		expect(cart.items).toHaveLength(1);
		expect(cart.items[0].qty).toBe(2);
		expect(cart.count).toBe(2);
		expect(cart.total).toBe(30);
	});

	it('se vacía con clear', () => {
		cart.add('Camiseta', 15);
		cart.clear();
		expect(cart.items).toEqual([]);
		expect(cart.total).toBe(0);
	});
});
