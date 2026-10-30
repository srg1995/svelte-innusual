import type { Todo } from '#lib/todo.js';
import type { PageLoad } from './$types';
import { base } from './paths';

// Load universal: el `fetch` que recibe llama al endpoint internamente en el servidor (sin salir a la
// red) y en el navegador reutiliza la respuesta ya serializada en el HTML.
export const load: PageLoad = async ({ fetch, depends }) => {
	depends('app:todos');
	const res = await fetch(`${base}/api/todos`);
	const todos: Todo[] = await res.json();
	return { todos };
};
