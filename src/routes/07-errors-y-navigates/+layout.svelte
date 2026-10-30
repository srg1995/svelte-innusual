<script lang="ts">
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { children }: LayoutProps = $props();

	let log = $state<string[]>([]);
	const add = (msg: string) => (log = [msg, ...log].slice(0, 6));

	// beforeNavigate: antes de salir de la página actual (se puede cancelar)
	beforeNavigate(({ type, to }) => add(`beforeNavigate (${type}) → ${to?.url.pathname ?? 'fuera del sitio'}`));

	// afterNavigate: cuando la nueva página ya está montada (también al cargar la primera vez)
	afterNavigate(({ type, to }) => add(`afterNavigate (${type}) ✔ ${to?.url.pathname}`));

	// onNavigate: justo antes de actualizar el DOM; permite animar con View Transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<main class="grid min-h-screen place-items-start justify-center bg-ink-50 p-8 pt-16">
	<div class="w-full max-w-xl space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">07 · Errors y navigates</h1>
			<p class="text-sm text-ink-500">Gestión de errores y navegación programática</p>
		</header>

		<nav class="flex flex-wrap gap-3 text-sm text-brand-600 underline">
			<a href={base}>Inicio</a>
			<a href="{base}/destino">Destino</a>
		</nav>

		{@render children()}

		<section>
			<h2 class="mb-1 text-sm font-medium text-ink-900">Registro de navegación</h2>
			<ul class="text-xs text-ink-500">
				{#each log as entry, i (i)}<li>{entry}</li>{/each}
			</ul>
		</section>
	</div>
</main>
