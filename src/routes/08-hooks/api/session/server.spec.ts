import { describe, expect, it, vi } from 'vitest';
import { asEvent, thrown } from '../../../../test/helpers';
import { DELETE, POST } from './+server';

const cookies = () => ({ set: vi.fn(), delete: vi.fn() });

const post = (body: string, jar = cookies()) => ({
	jar,
	event: asEvent<Parameters<typeof POST>[0]>({
		cookies: jar,
		request: new Request('http://localhost/08-hooks/api/session', { method: 'POST', body })
	})
});

describe('POST /08-hooks/api/session', () => {
	it('guarda el nombre (sin espacios) en una cookie httpOnly', async () => {
		const { jar, event } = post(JSON.stringify({ name: '  Ana ' }));
		const res = await POST(event);
		expect(await res.json()).toEqual({ ok: true });
		expect(jar.set).toHaveBeenCalledWith(
			'session',
			'Ana',
			expect.objectContaining({ path: '/', httpOnly: true, sameSite: 'lax' })
		);
	});

	it.each([
		['sin name', JSON.stringify({})],
		['name vacío', JSON.stringify({ name: '  ' })],
		['name que no es string', JSON.stringify({ name: 1 })],
		['JSON inválido', '{x']
	])('responde 400 %s y no crea la cookie', async (_name, body) => {
		const { jar, event } = post(body);
		expect(await thrown(() => POST(event))).toMatchObject({ status: 400 });
		expect(jar.set).not.toHaveBeenCalled();
	});
});

describe('DELETE /08-hooks/api/session', () => {
	it('borra la cookie y responde 204', async () => {
		const jar = cookies();
		const res = await DELETE(asEvent<Parameters<typeof DELETE>[0]>({ cookies: jar }));
		expect(res.status).toBe(204);
		expect(jar.delete).toHaveBeenCalledWith('session', { path: '/' });
	});
});
