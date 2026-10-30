import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit/hooks';
import { session, timing } from '#lib/server/handles.js';

// Los hooks son globales: afectan a TODAS las rutas de la aplicación, no solo a una diapositiva.

// ── handle (07 y 08) ───────────────────────────────────────────────────────────────────────────
// Es un middleware: se ejecuta en cada petición, antes de resolver la ruta y después de obtener la respuesta.
// timing (id y tiempos) y session (cookie y zona privada) están en src/lib/server/handles.ts.

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
