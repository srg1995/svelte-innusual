<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import type { PageProps } from './$types';
	import { base } from './paths';

	let { data }: PageProps = $props();
</script>

<!-- Un <form method="GET"> navega a ?q=... sin JavaScript; con JS lo hace SvelteKit sin recargar -->
<form method="GET" class="flex gap-2">
	{#if data.category}<input type="hidden" name="category" value={data.category} />{/if}
	<input
		name="q"
		value={data.q}
		placeholder="Buscar producto"
		class="w-full rounded-lg border border-ink-200 px-3 py-2"
	/>
	<button class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">Buscar</button>
</form>

<ul class="space-y-2">
	{#each data.products as product (product.id)}
		<li>
			<a
				href="{base}/{product.id}"
				class="flex justify-between rounded-lg border border-ink-200 px-3 py-2 text-ink-900"
			>
				<span>{product.name}</span>
				<span class="text-ink-500">{product.price} €</span>
			</a>
		</li>
	{:else}
		<li class="text-sm text-ink-500">Sin resultados.</li>
	{/each}
</ul>

<div class="flex items-center gap-3 text-sm text-ink-500">
	<span>Cargado a las {data.loadedAt}</span>
	<button onclick={() => invalidate('app:products')} class="underline">Volver a cargar</button>
	<button onclick={() => goto(`${base}/999`)} class="underline">Ir a un producto inexistente</button
	>
	<button onclick={() => goto(`${base}/abc`)} class="underline">Ir a /abc</button>
</div>

<!--

Resumen: SvelteKit frente a Next.js, Nuxt y React Router

Los ejemplos de esta sección están repartidos en varios archivos: +layout.svelte, +layout.server.ts,
+page.server.ts, +error.svelte, [id=integer]/+page.server.ts y src/params.ts.

1. Enrutamiento
   - Next.js (App Router): también por carpetas, con page.tsx, layout.tsx y [id] para parámetros.
   - Nuxt: por carpetas y archivos en pages/, con [id].vue.
   - React Router: las rutas se declaran en código (o con convención de archivos en modo framework).
   - SvelteKit: cada carpeta de src/routes es una ruta y los archivos con "+" definen su comportamiento
     (+page, +layout, +error, +server). Los parámetros van entre corchetes ([id]) y se validan con
     matchers ([id=integer]), así una URL inválida da 404 sin ejecutar ningún load.

2. Carga de datos
   - Next.js: componentes de servidor con async/await y fetch dentro del propio componente; la
     caché y la revalidación tienen reglas propias que cuesta dominar.
   - Nuxt: useFetch y useAsyncData dentro del componente.
   - React Router: loaders por ruta, muy parecidos a los de SvelteKit.
   - SvelteKit: una función load por ruta, separada del componente, que devuelve un objeto tipado
     (PageProps) sin código extra. Hay dos tipos: +page.server.ts (solo servidor, puede usar bases de
     datos y secretos) y +page.ts (universal, corre en servidor y en navegador).

3. Datos compartidos y layouts
   - Los layouts anidados comparten sus datos con las páginas hijas, que pueden leerlos con
     await parent(). Next.js y Nuxt resuelven lo mismo, pero sin un flujo de datos tan explícito.

4. Revalidación
   - SvelteKit repite load solo cuando cambia algo de lo que lee (params, url.searchParams) o
     cuando se llama a invalidate('app:products'). Next.js usa revalidatePath y revalidateTag.

5. Streaming
   - Devolver una promesa sin await en load basta para que la página se muestre ya y los datos lentos
     lleguen después, mostrados con {#await}. En Next.js se hace con Suspense y componentes aparte.

6. Errores y navegación
   - +error.svelte se renderiza dentro del layout de su sección, y error(404, ...) lo activa desde
     cualquier load.
   - data-sveltekit-preload-data="hover" precarga los datos al pasar el ratón; no hace falta un
     componente Link especial: son enlaces <a> normales.
   - Un <form method="GET"> funciona sin JavaScript y SvelteKit lo convierte en navegación del lado
     cliente.

Conclusión: SvelteKit se parece mucho a Remix y React Router en el modelo de loaders, pero con
enrutamiento por carpetas, tipos generados automáticamente y enlaces y formularios del navegador sin
componentes especiales.

-->
