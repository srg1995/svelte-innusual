import type { LayoutServerLoad } from './$types';
import { categories } from '#lib/server/products.js';

// Los datos del layout llegan a todas las páginas hijas (como data o con await parent())
export const load: LayoutServerLoad = async () => ({ categories });
