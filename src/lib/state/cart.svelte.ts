// Las runes funcionan en cualquier archivo .svelte.ts / .svelte.js, no solo en componentes.
// En React esto sería un Context + Provider + useReducer + useMemo + un hook para consumirlo.

export type CartItem = { id: number; name: string; price: number; qty: number };

class Cart {
	// No se puede exportar un `let x = $state()` que se reasigne; una clase (o un objeto) sí.
	items = $state<CartItem[]>([]);
	count = $derived(this.items.reduce((sum, i) => sum + i.qty, 0));
	total = $derived(this.items.reduce((sum, i) => sum + i.price * i.qty, 0));

	add(name: string, price: number) {
		const existing = this.items.find((i) => i.name === name);
		if (existing) existing.qty++;
		else this.items.push({ id: Date.now(), name, price, qty: 1 });
	}

	clear() {
		this.items = [];
	}
}

// Singleton de módulo: cualquier componente que lo importe comparte el mismo estado,
// sin props, sin Provider. Ojo: en SSR el módulo se comparte entre peticiones,
// así que para estado por usuario conviene usar context (ver settings.svelte.ts).
export const cart = new Cart();
