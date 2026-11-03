import { describe, expect, it } from 'vitest';
import { asEvent, thrown } from '../../../../test/helpers';
import { GET, POST } from './+server';

const post = (body: string) =>
	asEvent<Parameters<typeof POST>[0]>({
		request: new Request('http://localhost/api/todos', { method: 'POST', body })
	});

describe('GET /api/todos', () => {
	it('devuelve la lista en JSON', async () => {
		const res = await GET(
			asEvent<Parameters<typeof GET>[0]>({ url: new URL('http://localhost/api/todos') })
		);
		expect(res).toBeInstanceOf(Response);
		expect(res.headers.get('content-type')).toContain('application/json');
		const todos: { done: boolean }[] = await res.json();
		expect(todos.length).toBeGreaterThan(0);
	});

	it('filtra por ?done', async () => {
		const res = await GET(
			asEvent<Parameters<typeof GET>[0]>({ url: new URL('http://localhost/api/todos?done=true') })
		);
		const todos: { done: boolean }[] = await res.json();
		expect(todos.every((t) => t.done)).toBe(true);
	});
});

describe('POST /api/todos', () => {
	it('crea una tarea y responde 201', async () => {
		const res = await POST(post(JSON.stringify({ text: '  Nueva  ' })));
		expect(res.status).toBe(201);
		expect(await res.json()).toMatchObject({ text: 'Nueva', done: false });
	});

	it.each([
		['sin text', JSON.stringify({})],
		['text vacío', JSON.stringify({ text: '   ' })],
		['text que no es string', JSON.stringify({ text: 5 })],
		['JSON inválido', '{x']
	])('responde 400 %s', async (_name, body) => {
		expect(await thrown(() => POST(post(body)))).toMatchObject({ status: 400 });
	});
});
