// No se renderiza en el servidor: el HTML llega vacío y la página se pinta en el navegador.
// Útil cuando el componente depende de APIs que solo existen en el cliente (window, canvas...).
export const ssr = false;
