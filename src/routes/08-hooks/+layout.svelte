<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { data, children }: LayoutProps = $props();
</script>

<SlideShell
	number="08"
	title="Hooks"
	description="Petición {data.requestId} · {data.user
		? `sesión de ${data.user.name}`
		: 'sin sesión'}"
>
	<nav class="mb-5 flex flex-wrap gap-2 text-sm">
		<a
			href={base}
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>Inicio</a
		>
		<a
			href="{base}/privado"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>Zona privada</a
		>
		<a
			href="{base}/antiguo"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>URL antigua (reroute)</a
		>
	</nav>

	{@render children()}
</SlideShell>
