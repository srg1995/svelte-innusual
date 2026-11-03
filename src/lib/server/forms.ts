// Lógica de los formularios de la diapositiva 05: validación y un almacén en memoria.
// Vive fuera de +page.server.ts para poder probarla sin levantar el servidor.

export type SubscriptionValues = { name: string; email: string; plan: 'free' | 'pro' };
export type SubscriptionErrors = { name?: string; email?: string };

type SubscriptionResult =
	| { ok: true; values: SubscriptionValues }
	| { ok: false; values: SubscriptionValues; errors: SubscriptionErrors };

// Se devuelven también los valores recibidos: así el formulario puede volver a rellenarse tras un fallo
export function validateSubscription(data: FormData): SubscriptionResult {
	const values: SubscriptionValues = {
		name: String(data.get('name') ?? '').trim(),
		email: String(data.get('email') ?? '').trim(),
		plan: data.get('plan') === 'pro' ? 'pro' : 'free'
	};
	const errors: SubscriptionErrors = {};
	if (values.name.length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres';
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Introduce un email válido';

	return Object.keys(errors).length > 0 ? { ok: false, values, errors } : { ok: true, values };
}

export type Message = { id: number; text: string; likes: number };

export const MAX_MESSAGE_LENGTH = 80;

// Devuelve el motivo del rechazo, o undefined si el texto es válido
export function validateMessage(text: string): string | undefined {
	if (text.length === 0) return 'Escribe un mensaje';
	if (text.length > MAX_MESSAGE_LENGTH) return `Máximo ${MAX_MESSAGE_LENGTH} caracteres`;
}

// Almacén en memoria solo para la demo: se reinicia con el servidor y se comparte entre peticiones.
let nextId = 3;
let messages: Message[] = [
	{ id: 1, text: 'Los formularios funcionan sin JavaScript', likes: 2 },
	{ id: 2, text: 'use:enhance los mejora sin recargar', likes: 1 }
];

export const listMessages = () => messages;

export function addMessage(text: string): Message {
	const message: Message = { id: nextId++, text, likes: 0 };
	messages = [...messages, message];
	return message;
}

export function likeMessage(id: number): boolean {
	const message = messages.find((m) => m.id === id);
	if (message) message.likes++;
	return message !== undefined;
}

export function removeMessage(id: number): boolean {
	const before = messages.length;
	messages = messages.filter((m) => m.id !== id);
	return messages.length < before;
}
