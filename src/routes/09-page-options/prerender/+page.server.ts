import type { PageServerLoad } from './$types';

// El HTML (y los datos de load) se generan una sola vez al ejecutar `vite build`
export const prerender = true;

export const load: PageServerLoad = () => ({
	generatedAt: new Date().toLocaleString('es-ES')
});
