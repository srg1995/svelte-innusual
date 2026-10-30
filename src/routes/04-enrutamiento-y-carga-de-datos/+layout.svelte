<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { navigating, page } from '$app/state';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { data, children }: LayoutProps = $props();
</script>

<!-- Precarga los datos de la página al pasar el ratón por encima del enlace -->
<div data-sveltekit-preload-data="hover">
	<SlideShell
		number="04"
		title="Enrutamiento y carga de datos"
		description="Rutas por carpetas, layouts anidados, funciones load, matchers y streaming."
	>
		<nav class="mb-5 flex flex-wrap gap-2 text-sm">
			<a
				href={base}
				class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
				>Todos</a
			>
			{#each data.categories as category (category.id)}
				<a
					href="{base}?category={category.id}"
					class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
					>{category.label}</a
				>
			{/each}
		</nav>

		<div class="grid gap-5 lg:grid-cols-3">
			<div class="lg:col-span-2">
				<DemoCard
					title="Catálogo"
					description="El contenido cambia con la ruta; el layout se mantiene."
				>
					{@render children()}
				</DemoCard>
			</div>

			<DemoCard title="Estado de la ruta">
				<p class="text-sm text-ink-500">Ruta actual: <code>{page.route.id}</code></p>
				<p class="text-sm text-ink-500">
					{#if navigating.to}
						<span class="text-brand-600"
							>Navegando a <code>{navigating.to.url.pathname}</code>…</span
						>
					{:else}
						Sin navegación en curso.
					{/if}
				</p>
			</DemoCard>
		</div>
	</SlideShell>
</div>
