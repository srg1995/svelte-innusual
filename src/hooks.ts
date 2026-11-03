import type { Reroute } from '@sveltejs/kit/hooks';

// reroute es un hook universal (servidor y navegador): decide qué ruta renderiza una URL
// sin cambiar la URL que ve el usuario.
export const reroute: Reroute = ({ url }) => {
	if (url.pathname === '/09-hooks/antiguo') return '/09-hooks/nuevo';
};
