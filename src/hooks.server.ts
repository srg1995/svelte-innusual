import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit/hooks';

// Los hooks son globales: afectan a TODAS las rutas de la aplicación, no solo a una diapositiva.

// ── handle (07 y 08) ───────────────────────────────────────────────────────────────────────────
// Es un middleware: se ejecuta en cada petición, antes de resolver la ruta y después de obtener la respuesta.

// 1. Asigna un id a la petición y mide cuánto tarda en responderse
const timing: Handle = async ({ event, resolve }) => {
	event.locals.requestId = crypto.randomUUID().slice(0, 8);
	const start = performance.now();

	const response = await resolve(event);

	response.headers.set('x-response-time', `${(performance.now() - start).toFixed(1)} ms`);
	response.headers.set('x-request-id', event.locals.requestId);
	return response;
};

// 2. Lee la sesión de la cookie, la deja en locals y protege una zona
const session: Handle = async ({ event, resolve }) => {
	const name = event.cookies.get('session');
	event.locals.user = name ? { name } : undefined;

	if (event.url.pathname.startsWith('/08-hooks/privado') && !event.locals.user) {
		redirect(303, '/08-hooks?aviso=login');
	}

	return resolve(event);
};

// sequence encadena varios handle en orden
export const handle: Handle = sequence(timing, session);

// ── handleFetch (08) ───────────────────────────────────────────────────────────────────────────
// Intercepta el event.fetch de load y +server.ts (peticiones del servidor)
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (new URL(request.url).origin === event.url.origin) {
		request.headers.set('x-origin-request-id', event.locals.requestId);
	}
	return fetch(request);
};

// ── handleError (07) ───────────────────────────────────────────────────────────────────────────
// Recibe todos los errores, con `kind`: 'app' (error()), 'framework' (404 del router...),
// 'validation' y 'unknown' (excepciones no controladas).
export const handleError: HandleServerError = ({ kind, error, event }) => {
	// Los esperados se muestran tal cual: no devolvemos nada y se mantienen status y mensaje
	if (kind !== 'unknown') return;

	const errorId = crypto.randomUUID();

	// El detalle real (stack, datos internos) se queda en el servidor...
	console.error(`[${errorId}] ${event.url.pathname}`, error);

	// ...y al usuario solo le llega un mensaje genérico y un identificador para soporte
	return { message: 'Ha ocurrido un error inesperado', errorId };
};
