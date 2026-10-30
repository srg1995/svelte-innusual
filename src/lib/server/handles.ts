import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

// Handles de hooks.server.ts, separados en un módulo para poder probarlos sin el servidor:
// sequence() necesita el contexto interno de SvelteKit, que solo existe dentro de una petición real.

// 1. Asigna un id a la petición y mide cuánto tarda en responderse
export const timing: Handle = async ({ event, resolve }) => {
	event.locals.requestId = crypto.randomUUID().slice(0, 8);
	const start = performance.now();

	const response = await resolve(event);

	response.headers.set('x-response-time', `${(performance.now() - start).toFixed(1)} ms`);
	response.headers.set('x-request-id', event.locals.requestId);
	return response;
};

// 2. Lee la sesión de la cookie, la deja en locals y protege una zona
export const session: Handle = async ({ event, resolve }) => {
	const name = event.cookies.get('session');
	event.locals.user = name ? { name } : undefined;

	if (event.url.pathname.startsWith('/08-hooks/privado') && !event.locals.user) {
		redirect(303, '/08-hooks?aviso=login');
	}

	return resolve(event);
};
