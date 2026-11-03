import type { PageServerLoad } from './$types';

// Error inesperado: una excepción cualquiera. Su mensaje NO llega al cliente (lo filtra handleError).
export const load: PageServerLoad = () => {
	throw new Error('Fallo de conexión a la base de datos (password=1234)');
};
