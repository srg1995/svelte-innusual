// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// Forma común de los errores: lo que devuelven error() y handleError, y lo que lee page.error
		interface Error {
			message: string;
			code?: string;
			errorId?: string;
		}
		// Datos por petición: los rellena handle en hooks.server.ts y los leen load y +server.ts
		interface Locals {
			requestId: string;
			user?: { name: string };
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
