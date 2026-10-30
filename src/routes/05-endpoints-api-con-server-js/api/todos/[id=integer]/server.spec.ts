import { describe, expect, it } from 'vitest';
import { asEvent, thrown } from '../../../../../test/helpers';
import { DELETE, GET, PATCH } from './+server';

const ev = <T extends (...args: never[]) => unknown>(id: number, body?: string) =>
	asEvent<Parameters<T>[0]>({
		params: { id },
		request: new Request('http://localhost/api/todos/' + id, { method: 'PATCH', body })
	});

describe('/api/todos/[id]', () => {
	it('GET devuelve la tarea o 404', async () => {
		const res = await GET(ev<typeof GET>(1));
		expect(await res.json()).toMatchObject({ id: 1 });
		expect(await thrown(() => GET(ev<typeof GET>(999)))).toMatchObject({ status: 404 });
	});

	it('PATCH aplica solo los campos válidos', async () => {
		const res = await PATCH(
			ev<typeof PATCH>(2, JSON.stringify({ done: true, text: 'Editada', id: 99, x: 1 }))
		);
		expect(await res.json()).toEqual({ id: 2, text: 'Editada', done: true });
	});

	it('PATCH ignora tipos incorrectos', async () => {
		const res = await PATCH(ev<typeof PATCH>(3, JSON.stringify({ done: 'sí', text: 5 })));
		expect(await res.json()).toMatchObject({ id: 3, done: false });
	});

	it('PATCH responde 400 con un body inválido y 404 si no existe', async () => {
		expect(await thrown(() => PATCH(ev<typeof PATCH>(2, '{x')))).toMatchObject({ status: 400 });
		expect(await thrown(() => PATCH(ev<typeof PATCH>(999, '{}')))).toMatchObject({ status: 404 });
	});

	it('DELETE responde 204 y después 404', async () => {
		const res = await DELETE(ev<typeof DELETE>(1));
		expect(res.status).toBe(204);
		expect(await thrown(() => DELETE(ev<typeof DELETE>(1)))).toMatchObject({ status: 404 });
	});
});
