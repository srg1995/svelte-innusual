import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Devuelve lo que han dejado los hooks: locals (handle) y la cabecera añadida por handleFetch
export const GET: RequestHandler = ({ locals, request }) =>
	json({
		requestId: locals.requestId,
		originRequestId: request.headers.get('x-origin-request-id'),
		user: locals.user ?? null
	});
