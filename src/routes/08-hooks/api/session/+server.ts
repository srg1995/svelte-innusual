import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body: unknown = await request.json().catch(() => null);
	if (typeof body !== 'object' || body === null || !('name' in body) || typeof body.name !== 'string' || !body.name.trim()) {
		error(400, 'name es obligatorio');
	}

	cookies.set('session', body.name.trim(), { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 3600 });
	return json({ ok: true });
};

export const DELETE: RequestHandler = ({ cookies }) => {
	cookies.delete('session', { path: '/' });
	return new Response(null, { status: 204 });
};
