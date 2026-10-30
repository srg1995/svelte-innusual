<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { children }: LayoutProps = $props();
</script>

<SlideShell
	number="09"
	title="Page options"
	description="Se exportan desde +page.ts, +page.server.ts o los layouts, y se heredan por las rutas hijas."
>
	<nav class="mb-5 flex flex-wrap gap-2 text-sm">
		<a
			href={base}
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>Inicio</a
		>
		<a
			href="{base}/prerender"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>prerender</a
		>
		<a
			href="{base}/sin-ssr"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>ssr = false</a
		>
		<a
			href="{base}/sin-csr"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>csr = false</a
		>
		<a
			href="{base}/slash/"
			class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
			>trailingSlash</a
		>
	</nav>

	{@render children()}
</SlideShell>
