import { beforeEach, describe, expect, it, vi } from 'vitest';

// El almacén vive en una variable de módulo: se recarga el módulo en cada test para aislarlos
async function loadStore() {
	vi.resetModules();
	return import('./forms');
}

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [key, value] of Object.entries(fields)) data.set(key, value);
	return data;
};

describe('validateSubscription', () => {
	let store: Awaited<ReturnType<typeof loadStore>>;

	beforeEach(async () => {
		store = await loadStore();
	});

	it('acepta datos válidos y recorta los espacios', () => {
		const result = store.validateSubscription(
			form({ name: '  Ana ', email: ' ana@innusual.tech ', plan: 'pro' })
		);
		expect(result).toEqual({
			ok: true,
			values: { name: 'Ana', email: 'ana@innusual.tech', plan: 'pro' }
		});
	});

	it('usa el plan gratuito salvo que se pida pro', () => {
		const result = store.validateSubscription(form({ name: 'Ana', email: 'a@b.co', plan: 'x' }));
		expect(result.values.plan).toBe('free');
	});

	it('devuelve un error por campo y conserva los valores recibidos', () => {
		const result = store.validateSubscription(form({ name: 'A', email: 'no-es-un-email' }));
		expect(result).toEqual({
			ok: false,
			values: { name: 'A', email: 'no-es-un-email', plan: 'free' },
			errors: {
				name: 'El nombre debe tener al menos 2 caracteres',
				email: 'Introduce un email válido'
			}
		});
	});

	it('trata los campos ausentes como vacíos', () => {
		const result = store.validateSubscription(new FormData());
		expect(result.ok).toBe(false);
		expect(result.values).toEqual({ name: '', email: '', plan: 'free' });
	});
});

describe('validateMessage', () => {
	it('rechaza el texto vacío y el demasiado largo', async () => {
		const store = await loadStore();
		expect(store.validateMessage('')).toBe('Escribe un mensaje');
		expect(store.validateMessage('x'.repeat(store.MAX_MESSAGE_LENGTH + 1))).toBe(
			`Máximo ${store.MAX_MESSAGE_LENGTH} caracteres`
		);
	});

	it('acepta un texto dentro del límite', async () => {
		const store = await loadStore();
		expect(store.validateMessage('x'.repeat(store.MAX_MESSAGE_LENGTH))).toBeUndefined();
	});
});

describe('mensajes', () => {
	let store: Awaited<ReturnType<typeof loadStore>>;

	beforeEach(async () => {
		store = await loadStore();
	});

	it('empieza con dos mensajes de ejemplo', () => {
		expect(store.listMessages().map((m) => m.id)).toEqual([1, 2]);
	});

	it('añade mensajes con ids correlativos y sin likes', () => {
		expect(store.addMessage('Hola')).toEqual({ id: 3, text: 'Hola', likes: 0 });
		expect(store.addMessage('Otro').id).toBe(4);
		expect(store.listMessages()).toHaveLength(4);
	});

	it('suma un like solo si el mensaje existe', () => {
		expect(store.likeMessage(1)).toBe(true);
		expect(store.listMessages()[0].likes).toBe(3);
		expect(store.likeMessage(999)).toBe(false);
	});

	it('elimina un mensaje solo si existe', () => {
		expect(store.removeMessage(1)).toBe(true);
		expect(store.listMessages().map((m) => m.id)).toEqual([2]);
		expect(store.removeMessage(999)).toBe(false);
	});
});
