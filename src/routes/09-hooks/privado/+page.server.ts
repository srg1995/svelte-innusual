import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { base } from '#routes/09-hooks/paths.js';

// Segunda barrera: aunque la página se pidiera sin pasar por handle (historial, cookie caducada),
// load comprueba la sesión y garantiza que `user` existe
export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) redirect(303, `${base}?aviso=login`);
	return { user: locals.user };
};
