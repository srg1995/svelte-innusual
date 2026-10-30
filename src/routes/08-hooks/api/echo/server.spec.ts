import { describe, expect, it } from 'vitest';
import { asEvent } from '../../../../test/helpers';
import { GET } from './+server';

const call = (headers: Record<string, string>, locals: object) =>
	GET(
		asEvent<Parameters<typeof GET>[0]>({
			locals,
			request: new Request('http://localhost/08-hooks/api/echo', { headers })
		})
	);

describe('GET /08-hooks/api/echo', () => {
	it('devuelve lo que dejaron los hooks: locals y la cabecera de handleFetch', async () => {
		const res = await call(
			{ 'x-origin-request-id': 'padre123' },
			{ requestId: 'abc12345', user: { name: 'Ana' } }
		);
		expect(await res.json()).toEqual({
			requestId: 'abc12345',
			originRequestId: 'padre123',
			user: { name: 'Ana' }
		});
	});

	it('usa null si no hay cabecera ni sesión', async () => {
		const res = await call({}, { requestId: 'abc12345' });
		expect(await res.json()).toEqual({
			requestId: 'abc12345',
			originRequestId: null,
			user: null
		});
	});
});
