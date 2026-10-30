<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		wide = false,
		children
	}: { title: string; description?: string; wide?: boolean; children: Snippet } = $props();
</script>

<section
	class="min-w-0 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm {wide
		? 'lg:col-span-2'
		: ''}"
>
	<header class="mb-4">
		<h2 class="flex items-center gap-2 text-base font-semibold text-innusual-ink">
			<span class="h-4 w-1 rounded-full bg-gradient-to-b from-innusual-teal to-innusual-purple"
			></span>
			{title}
		</h2>
		{#if description}<p class="mt-1 text-sm text-ink-500">{description}</p>{/if}
	</header>
	<div class="space-y-3">{@render children()}</div>
</section>
