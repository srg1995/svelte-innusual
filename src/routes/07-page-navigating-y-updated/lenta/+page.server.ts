import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Mientras espera, `navigating` tiene valor y la página anterior sigue visible
	await new Promise((resolve) => setTimeout(resolve, 1500));
	return { message: 'Datos cargados tras 1,5 s' };
};
