import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProduct, getReviews } from '#lib/server/products.js';

export const load: PageServerLoad = async ({ params, parent }) => {
	// Gracias al matcher integer, params.id ya es un number
	const product = await getProduct(params.id);
	if (!product) error(404, `El producto ${params.id} no existe`);

	// parent() devuelve los datos del layout (se ejecutan en paralelo con este load si no se espera antes)
	const { categories } = await parent();
	const categoryLabel = categories.find((c) => c.id === product.category)?.label ?? product.category;

	return {
		product,
		categoryLabel,
		// Sin await: la página se muestra ya y las reseñas llegan después por streaming
		reviews: getReviews(product.id)
	};
};
