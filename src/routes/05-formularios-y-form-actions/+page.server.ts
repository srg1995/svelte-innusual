import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	addMessage,
	likeMessage,
	listMessages,
	removeMessage,
	validateMessage,
	validateSubscription
} from '#lib/server/forms.js';

export const load: PageServerLoad = () => ({ messages: listMessages() });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// `which` identifica qué formulario envió la petición: todas las actions comparten la prop `form`
async function subscribe(request: Request, which: 'plain' | 'enhanced', delay = 0) {
	const result = validateSubscription(await request.formData());
	if (delay) await sleep(delay); // simula un servidor lento para ver el estado "enviando"

	// fail() responde con un 400 y los datos que recibirá `form`; sin él se perdería lo escrito
	if (!result.ok) return fail(400, { which, errors: result.errors, values: result.values });
	return { which, success: true as const, values: result.values };
}

const idOf = async (request: Request) => Number((await request.formData()).get('id'));

// Cada propiedad es una action con nombre: se invoca con <form action="?/nombre"> o formaction="?/nombre"
export const actions = {
	plain: ({ request }) => subscribe(request, 'plain'),
	enhanced: ({ request }) => subscribe(request, 'enhanced', 700),

	add: async ({ request }) => {
		const text = String((await request.formData()).get('text') ?? '').trim();
		const error = validateMessage(text);
		if (error) return fail(400, { which: 'add' as const, text, error });

		addMessage(text);
		return { which: 'add' as const, success: true as const };
	},

	like: async ({ request }) => {
		if (!likeMessage(await idOf(request))) {
			return fail(404, { which: 'like' as const, error: 'El mensaje ya no existe' });
		}
		return { which: 'like' as const, success: true as const };
	},

	remove: async ({ request }) => {
		if (!removeMessage(await idOf(request))) {
			return fail(404, { which: 'remove' as const, error: 'El mensaje ya no existe' });
		}
		return { which: 'remove' as const, success: true as const };
	}
} satisfies Actions;
