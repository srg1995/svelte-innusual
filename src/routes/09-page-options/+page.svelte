<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
</script>

<DemoCard
	title="Opciones"
	description="Cada enlace de arriba es una ruta con una opción distinta. Las rutas hijas heredan las del layout y pueden sobrescribirlas."
>
	<table class="w-full text-left text-sm">
		<thead class="text-ink-500">
			<tr><th class="py-1">Opción</th><th>Por defecto</th><th>Qué hace</th></tr>
		</thead>
		<tbody class="divide-y divide-ink-100 text-ink-900">
			<tr
				><td class="py-2"><code>prerender</code></td><td>false</td><td
					>Genera el HTML en la compilación</td
				></tr
			>
			<tr><td class="py-2"><code>ssr</code></td><td>true</td><td>Renderiza en el servidor</td></tr>
			<tr
				><td class="py-2"><code>csr</code></td><td>true</td><td
					>Envía JavaScript e hidrata en el navegador</td
				></tr
			>
			<tr
				><td class="py-2"><code>trailingSlash</code></td><td>'never'</td><td
					>Barra final en la URL</td
				></tr
			>
		</tbody>
	</table>
</DemoCard>

<!--

Resumen: page options de SvelteKit frente a otros frameworks

Se exportan como constantes desde +page.ts, +page.server.ts o los layouts, y las rutas hijas heredan
las del layout (y pueden sobrescribirlas). Cada subruta de esta sección usa una distinta.

1. prerender
   - prerender = true genera el HTML en la compilación (vite build). La hora de la subruta prerender
     no cambia aunque se recargue, porque es la de la compilación. Con prerender = 'auto' se genera
     lo que se pueda, y las rutas dinámicas necesitan entries() para saber qué parámetros generar.
   - No es posible si la página depende de la petición (cookies, url.searchParams...).
   - Next.js: generateStaticParams y la opción dynamic = 'force-static'. Nuxt: routeRules con prerender.
     Astro es estático por defecto.

2. ssr
   - ssr = false desactiva el renderizado en el servidor: el HTML llega vacío y la página se pinta en
     el navegador. Permite usar window o canvas sin comprobaciones, a costa de peor SEO y de ver la
     página más tarde. Si se aplica a todo el sitio, se obtiene una SPA.
   - Next.js lo resuelve con 'use client' y carga dinámica sin SSR; Nuxt, con ssr: false en routeRules.

3. csr
   - csr = false no envía JavaScript: la página es HTML puro, sin hidratación ni navegación del lado
     cliente. Los enlaces y los formularios funcionan como en una web tradicional, pero los eventos
     como el botón de la demo dejan de funcionar. Ideal para páginas de contenido.
   - En Next.js y Nuxt no hay una opción equivalente por ruta con el mismo nivel de simplicidad.

4. trailingSlash
   - 'never' (por defecto), 'always' o 'ignore'. Si la URL no coincide, SvelteKit redirige a la
     forma correcta (308). Next.js: opción trailingSlash en la configuración global.

5. Otras opciones
   - entries (parámetros a prerenderizar) y config (ajustes específicos del adaptador, por ejemplo
     el entorno de ejecución).

Conclusión: la estrategia de renderizado se decide ruta a ruta con una constante exportada junto a la
propia página, en lugar de una configuración global o de etiquetas especiales en los componentes. Una
misma aplicación puede mezclar páginas estáticas, dinámicas, solo cliente y sin JavaScript.

-->
