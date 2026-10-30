<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		number,
		title,
		description,
		children
	}: { number: string; title: string; description?: string; children: Snippet } = $props();
</script>

<svelte:head>
	<title>{number} · {title} · innusual</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl px-6 py-8">
	<header class="mb-8 flex items-start gap-4 border-b border-ink-200 pb-6">
		<span
			class="bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose bg-clip-text text-6xl leading-none font-bold text-transparent"
		>
			{number}
		</span>
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-innusual-ink">{title}</h1>
			{#if description}<p class="mt-1 text-ink-500">{description}</p>{/if}
		</div>
	</header>

	{@render children()}
</div>
