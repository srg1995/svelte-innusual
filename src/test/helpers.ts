// Utilidades para probar handlers de SvelteKit sin levantar el servidor.

// Construye un evento parcial con el tipo que espera el handler. Solo se rellenan los campos
// que el handler usa; el resto no existe, por eso hace falta pasar por unknown.
export function asEvent<T>(partial: object): T {
	return partial as unknown as T;
}

// Ejecuta algo que puede lanzar (de forma síncrona o asíncrona) y devuelve lo lanzado.
// error() y redirect() lanzan objetos que no siempre son instancias de Error.
export async function thrown(fn: () => unknown): Promise<unknown> {
	try {
		await fn();
	} catch (e) {
		return e;
	}
	throw new Error('Se esperaba que lanzara, pero no lo hizo');
}
