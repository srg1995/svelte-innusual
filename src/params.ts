import { defineParams } from '@sveltejs/kit/params';

// [id=integer]: la ruta solo coincide si el segmento son dígitos; si no, 404 sin ejecutar load.
// Devolver un valor lo convierte: params.id llega ya como number.
export const params = defineParams({
	integer: (param) => (/^\d+$/.test(param) ? Number(param) : undefined)
});
