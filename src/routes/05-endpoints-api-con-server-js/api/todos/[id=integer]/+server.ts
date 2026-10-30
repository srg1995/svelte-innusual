import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteTodo, getTodo, updateTodo } from '#lib/server/todos.js';

export const GET: RequestHandler = ({ params }) => {
	// Gracias al matcher integer, params.id ya es un number
	const todo = getTodo(params.id);
	if (!todo) error(404, `La tarea ${params.id} no existe`);
	return json(todo);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body: unknown = await request.json().catch(() => null);
	if (typeof body !== 'object' || body === null) error(400, 'Body JSON inválido');

	const changes: { text?: string; done?: boolean } = {};
	if ('text' in body && typeof body.text === 'string') changes.text = body.text;
	if ('done' in body && typeof body.done === 'boolean') changes.done = body.done;

	const todo = updateTodo(params.id, changes);
	if (!todo) error(404, `La tarea ${params.id} no existe`);
	return json(todo);
};

export const DELETE: RequestHandler = ({ params }) => {
	if (!deleteTodo(params.id)) error(404, `La tarea ${params.id} no existe`);
	// 204: éxito sin cuerpo
	return new Response(null, { status: 204 });
};
