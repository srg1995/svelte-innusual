<script lang="ts">
	import { beforeNavigate, goto, invalidateAll, preloadData } from '$app/navigation';
	import { base } from './paths';

	let draft = $state('');
	let preloaded = $state('');

	// Proteger cambios sin guardar: cancel() detiene la navegación
	beforeNavigate(({ cancel, type }) => {
		if (!draft) return;
		if (type === 'leave') {
			// Cerrar pestaña o salir del sitio: cancel() activa el aviso nativo del navegador
			cancel();
			return;
		}
		if (!confirm('Tienes texto sin guardar. ¿Salir de todas formas?')) cancel();
	});

	async function preload() {
		// Descarga el código y los datos de la ruta sin navegar a ella
		const result = await preloadData(`${base}/destino`);
		preloaded = result.type === 'loaded' ? `Precargada (status ${result.status})` : 'Redirección';
	}
</script>

<section class="space-y-2">
	<h2 class="text-sm font-medium text-ink-900">Errores</h2>
	<ul class="space-y-1 text-sm">
		<li>
			<a href="{base}/esperado" class="text-brand-600 underline">Error esperado</a>
			<span class="text-ink-500">· error(404, mensaje, &lbrace; code &rbrace;): el usuario ve el mensaje</span>
		</li>
		<li>
			<a href="{base}/inesperado" class="text-brand-600 underline">Error inesperado</a>
			<span class="text-ink-500">· excepción: handleError oculta el detalle y añade un id</span>
		</li>
		<li>
			<a href="{base}/redirigir" class="text-brand-600 underline">Redirección</a>
			<span class="text-ink-500">· redirect(303, …) desde load</span>
		</li>
	</ul>
</section>

<section class="space-y-2">
	<h2 class="text-sm font-medium text-ink-900">Navegación programática</h2>
	<div class="flex flex-wrap gap-2 text-sm">
		<button
			onclick={() => goto(`${base}/destino?modo=goto`)}
			class="rounded-lg border border-ink-200 px-3 py-1"
		>
			goto
		</button>
		<button
			onclick={() => goto(`${base}/destino?modo=replace`, { replaceState: true })}
			class="rounded-lg border border-ink-200 px-3 py-1"
		>
			goto + replaceState
		</button>
		<button
			onclick={() => goto(`${base}/destino?modo=invalidate`, { invalidateAll: true })}
			class="rounded-lg border border-ink-200 px-3 py-1"
		>
			goto + invalidateAll
		</button>
		<button onclick={preload} class="rounded-lg border border-ink-200 px-3 py-1">preloadData</button>
		<button onclick={() => invalidateAll()} class="rounded-lg border border-ink-200 px-3 py-1">
			invalidateAll
		</button>
	</div>
	{#if preloaded}<p class="text-xs text-ink-500">{preloaded}</p>{/if}
</section>

<section class="space-y-2">
	<h2 class="text-sm font-medium text-ink-900">beforeNavigate + cancel()</h2>
	<textarea
		bind:value={draft}
		rows="2"
		placeholder="Escribe algo y luego intenta navegar a otra página"
		class="w-full rounded-lg border border-ink-200 px-3 py-2"
	></textarea>
	<p class="text-xs text-ink-500">
		Si hay texto, cualquier navegación (enlaces, goto, atrás) pide confirmación.
	</p>
</section>

<!--

Resumen: errores y navegación en SvelteKit frente a otros frameworks

Archivos: +error.svelte, esperado/, inesperado/, redirigir/ (cada uno con su +page.server.ts),
+layout.svelte y src/hooks.server.ts (handleError). La forma de los errores se declara en src/app.d.ts.

1. Errores esperados e inesperados
   - Esperado: error(404, mensaje, { code }) en un load o endpoint. El usuario ve el mensaje y el
     código tal cual, y la página +error.svelte más cercana se renderiza dentro del layout.
   - Inesperado: cualquier excepción (throw new Error). El detalle nunca debe llegar al cliente: el
     hook handleError lo registra en el servidor y devuelve un mensaje genérico con un id de soporte.
   - En esta versión de SvelteKit (3) handleError recibe todos los errores, con un campo kind ('app',
     'framework', 'validation' o 'unknown'), y los esperados pueden dejarse pasar sin devolver nada.
   - La forma común de los errores se declara una vez en App.Error (app.d.ts) y queda tipada en
     page.error, en error() y en el hook.
   - Next.js: error.tsx para los inesperados, not-found.tsx y notFound() para los 404; hay que
     filtrar el detalle a mano. Nuxt: createError, showError y error.vue. React Router: errorElement
     y useRouteError.

2. Redirecciones
   - redirect(303, url) desde load o un endpoint corta la ejecución. Next.js y Nuxt tienen
     equivalentes (redirect, navigateTo); en SvelteKit es la misma función en servidor y cliente.

3. Navegación programática ($app/navigation)
   - goto con opciones (replaceState, noScroll, keepFocus, invalidateAll), invalidateAll para repetir
     los load y preloadData para descargar código y datos de una ruta sin navegar a ella.
   - Next.js: useRouter con push, replace y prefetch; solo funciona dentro de componentes de cliente.
     Nuxt: navigateTo y router.push. En SvelteKit son funciones importables desde cualquier sitio.

4. Ciclo de vida de una navegación
   - beforeNavigate (se puede cancelar: avisar de cambios sin guardar), onNavigate (justo antes de
     actualizar el DOM: ideal para View Transitions) y afterNavigate (la página nueva ya está montada).
   - Next.js no tiene un equivalente directo de beforeNavigate: bloquear la salida exige soluciones
     propias. React Router tiene useBlocker y Nuxt onBeforeRouteLeave.

Conclusión: SvelteKit distingue de forma explícita los errores que el usuario puede ver de los que no,
y trae como funciones del framework lo que en otros se resuelve con hooks, librerías o código propio.

-->
