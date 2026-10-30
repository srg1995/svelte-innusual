import { describe, expect, it, vi } from 'vitest';
import { asEvent, thrown } from './test/helpers';
import { handle, handleError, handleFetch } from './hooks.server';
import { session, timing } from '#lib/server/handles.js';

type HandleInput = Parameters<typeof timing>[0];
type Locals = { requestId?: string; user?: { name: string } };

function run(handler: typeof timing, path: string, sessionCookie?: string) {
	const locals: Locals = {};
	const resolve = vi.fn(async () => new Response('ok'));
	const input = asEvent<HandleInput>({
		event: {
			url: new URL('http://localhost' + path),
			cookies: { get: () => sessionCookie },
			locals
		},
		resolve
	});
	return { locals, resolve, result: handler(input) };
}

describe('handle', () => {
	it('se compone con sequence', () => {
		expect(handle).toBeTypeOf('function');
	});
});

describe('timing', () => {
	it('asigna requestId y añade las cabeceras de traza', async () => {
		const { locals, result } = run(timing, '/');
		const res = await result;
		expect(locals.requestId).toMatch(/^[0-9a-f]{8}$/);
		expect(res.headers.get('x-request-id')).toBe(locals.requestId);
		expect(res.headers.get('x-response-time')).toMatch(/ ms$/);
	});
});

describe('session', () => {
	it('lee el usuario de la cookie de sesión', async () => {
		const { locals, result } = run(session, '/', 'Ana');
		await result;
		expect(locals.user).toEqual({ name: 'Ana' });
	});

	it('sin cookie no hay usuario', async () => {
		const { locals, result } = run(session, '/');
		await result;
		expect(locals.user).toBeUndefined();
	});

	it('redirige la zona privada si no hay sesión, sin resolver la ruta', async () => {
		const { resolve, result } = run(session, '/08-hooks/privado');
		expect(await thrown(() => result)).toMatchObject({
			status: 303,
			location: '/08-hooks?aviso=login'
		});
		expect(resolve).not.toHaveBeenCalled();
	});

	it('deja pasar la zona privada con sesión', async () => {
		const { resolve, result } = run(session, '/08-hooks/privado', 'Ana');
		await result;
		expect(resolve).toHaveBeenCalledOnce();
	});
});

describe('handleFetch', () => {
	const call = (url: string) => {
		const fetchMock = vi.fn(
			async (request: Request) => new Response(request.headers.get('x-origin-request-id'))
		);
		const input = asEvent<Parameters<typeof handleFetch>[0]>({
			event: { url: new URL('http://localhost/'), locals: { requestId: 'abc12345' } },
			request: new Request(url),
			fetch: fetchMock
		});
		return handleFetch(input);
	};

	it('añade el id de la petición a las llamadas internas', async () => {
		expect(await (await call('http://localhost/api/echo')).text()).toBe('abc12345');
	});

	it('no lo añade a las peticiones externas', async () => {
		expect(await (await call('https://example.com/')).text()).toBe('');
	});
});

describe('handleError', () => {
	const input = (kind: string) =>
		asEvent<Parameters<typeof handleError>[0]>({
			kind,
			error: new Error('secreto: password=1234'),
			event: { url: new URL('http://localhost/x') }
		});

	it('oculta el detalle de los errores inesperados y devuelve un id', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const result = await handleError(input('unknown'));
		expect(result).toMatchObject({ message: 'Ha ocurrido un error inesperado' });
		expect(JSON.stringify(result)).not.toContain('password');
		expect(result).toHaveProperty('errorId');
		expect(spy).toHaveBeenCalledOnce();
		spy.mockRestore();
	});

	it.each(['app', 'framework'])('deja pasar los errores esperados (%s)', async (kind) => {
		expect(await handleError(input(kind))).toBeUndefined();
	});
});
