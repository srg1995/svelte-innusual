<script lang="ts">
	import { navigating, page } from '$app/state';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { data, children }: LayoutProps = $props();
</script>

<!-- Precarga los datos de la página al pasar el ratón por encima del enlace -->
<main
	data-sveltekit-preload-data="hover"
	class="grid min-h-screen place-items-start justify-center bg-ink-50 p-8"
>
	<div class="w-full max-w-xl space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">04 · Enrutamiento y carga de datos</h1>
			<p class="text-sm text-ink-500">
				Ruta actual: <code>{page.route.id}</code>
				{#if navigating.to}<span class="text-brand-600"> · navegando…</span>{/if}
			</p>
		</header>

		<nav class="flex flex-wrap gap-3 text-sm">
			<a href={base} class="text-brand-600 underline">Todos</a>
			{#each data.categories as category (category.id)}
				<a href="{base}?category={category.id}" class="text-brand-600 underline">
					{category.label}
				</a>
			{/each}
		</nav>

		{@render children()}
	</div>
</main>
