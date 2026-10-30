import type { LayoutServerLoad } from './$types';

// locals lo rellenó handle: así llega al resto de la aplicación
export const load: LayoutServerLoad = ({ locals }) => ({
	user: locals.user ?? null,
	requestId: locals.requestId
});
