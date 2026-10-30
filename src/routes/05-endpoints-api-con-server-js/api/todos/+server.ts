import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createTodo, listTodos } from '#lib/server/todos.js';

// Cada función exportada con nombre de verbo HTTP (GET, POST, PUT, PATCH, DELETE...) es un handler.
// HEAD y OPTIONS se generan solos a partir de GET y de los verbos definidos.
export const GET: RequestHandler = ({ url }) => {
	// GET /api/todos?done=true
	const done = url.searchParams.get('done');
	return json(listTodos(done === null ? undefined : done === 'true'));
};

export const POST: RequestHandler = async ({ request }) => {
	// El body llega sin validar: unknown obliga a comprobarlo antes de usarlo
	const body: unknown = await request.json().catch(() => null);

	if (
		typeof body !== 'object' ||
		body === null ||
		!('text' in body) ||
		typeof body.text !== 'string' ||
		!body.text.trim()
	) {
		error(400, 'El campo "text" es obligatorio');
	}

	return json(createTodo(body.text.trim()), { status: 201 });
};
