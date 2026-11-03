import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { base } from '../paths';

// 303 tras una acción, 307/308 para mantener el método. redirect() corta la ejecución.
export const load: PageServerLoad = () => {
	redirect(303, `${base}/destino?desde=redirect`);
};
