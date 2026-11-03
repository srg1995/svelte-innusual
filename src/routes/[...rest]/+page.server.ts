import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Ruta comodín: solo recibe las URL que no coinciden con ninguna otra página.
// Las diapositivas 04, 06 y 07 enseñan errores 404, y las URL de API deben seguir
// respondiendo 404 en vez de una redirección a HTML: en esos casos se mantiene el error.
const KEEP_404 = /^\/(04|06|07)-|\/api\//;

export const load: PageServerLoad = ({ url }) => {
	if (KEEP_404.test(url.pathname)) error(404, 'Página no encontrada');
	redirect(307, '/');
};
