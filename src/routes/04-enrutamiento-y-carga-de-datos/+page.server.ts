import type { PageServerLoad } from './$types';
import { listProducts } from '#lib/server/products.js';

export const load: PageServerLoad = async ({ url, depends }) => {
	// Clave propia para poder repetir este load con invalidate('app:products')
	depends('app:products');

	// Leer url.searchParams hace que load se vuelva a ejecutar cuando cambian
	const q = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? '';

	return {
		q,
		category,
		products: await listProducts({ q, category }),
		loadedAt: new Date().toLocaleTimeString()
	};
};
