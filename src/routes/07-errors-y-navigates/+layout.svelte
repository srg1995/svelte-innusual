<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { children }: LayoutProps = $props();

	let log = $state<string[]>([]);
	const add = (msg: string) => (log = [msg, ...log].slice(0, 6));

	// beforeNavigate: antes de salir de la página actual (se puede cancelar)
	beforeNavigate(({ type, to }) =>
		add(`beforeNavigate (${type}) → ${to?.url.pathname ?? 'fuera del sitio'}`)
	);

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

<SlideShell
	number="07"
	title="Errors y navigates"
	description="Gestión de errores y navegación programática."
>
	<nav class="mb-5 flex flex-wrap gap-2 text-sm">
		<a
			href={base}
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>Inicio</a
		>
		<a
			href="{base}/destino"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>Destino</a
		>
	</nav>

	<div class="space-y-5">
		{@render children()}

		<DemoCard
			title="Registro de navegación"
			description="Alimentado por beforeNavigate y afterNavigate."
		>
			<ul class="text-xs text-ink-500">
				{#each log as entry, i (i)}<li>{entry}</li>{:else}<li>Sin eventos todavía.</li>{/each}
			</ul>
		</DemoCard>
	</div>
</SlideShell>
