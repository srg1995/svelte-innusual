import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Error esperado: el mensaje y el código se muestran tal cual al usuario
export const load: PageServerLoad = () => {
	error(404, 'La reserva no existe', { code: 'BOOKING_NOT_FOUND' });
};
