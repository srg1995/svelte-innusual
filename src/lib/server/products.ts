// Datos de ejemplo. Vive en src/lib/server: SvelteKit prohíbe importarlo desde código de cliente.

export type Category = { id: string; label: string };
export type Product = { id: number; name: string; price: number; category: string; description: string };
export type Review = { author: string; rating: number; text: string };

export const categories: Category[] = [
	{ id: 'ropa', label: 'Ropa' },
	{ id: 'accesorios', label: 'Accesorios' }
];

const products: Product[] = [
	{ id: 1, name: 'Camiseta', price: 15, category: 'ropa', description: 'Algodón orgánico.' },
	{ id: 2, name: 'Sudadera', price: 35, category: 'ropa', description: 'Con capucha y bolsillo.' },
	{ id: 3, name: 'Gorra', price: 10, category: 'accesorios', description: 'Ajustable.' },
	{ id: 4, name: 'Mochila', price: 45, category: 'accesorios', description: '20 litros, impermeable.' }
];

const reviews: Record<number, Review[]> = {
	1: [{ author: 'Ana', rating: 5, text: 'Muy cómoda.' }],
	2: [
		{ author: 'Luis', rating: 4, text: 'Abriga bastante.' },
		{ author: 'Marta', rating: 5, text: 'Me encanta.' }
	],
	3: [],
	4: [{ author: 'Pau', rating: 4, text: 'Aguanta la lluvia.' }]
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function listProducts(filter: { q: string; category: string }): Promise<Product[]> {
	await delay(300);
	const q = filter.q.trim().toLowerCase();
	return products.filter(
		(p) =>
			(!filter.category || p.category === filter.category) &&
			(!q || p.name.toLowerCase().includes(q))
	);
}

export async function getProduct(id: number): Promise<Product | undefined> {
	await delay(200);
	return products.find((p) => p.id === id);
}

// Lenta a propósito: se sirve por streaming, sin bloquear la navegación
export async function getReviews(productId: number): Promise<Review[]> {
	await delay(2000);
	return reviews[productId] ?? [];
}
