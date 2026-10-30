<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Barra común a todas las diapositivas: volver a la home y logotipo. La home lleva su propio banner -->
{#if page.route.id !== '/'}
	<div class="sticky top-0 z-30 border-b border-ink-200 bg-white/85 backdrop-blur">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-2">
			<a
				href="/"
				class="rounded-full border border-ink-200 bg-white px-4 py-1.5 text-sm font-medium text-innusual-ink transition hover:border-innusual-purple hover:text-innusual-purple"
			>
				← Home
			</a>
			<img src="/brand/logo.png" alt="innusual" class="h-9 w-auto" />
		</div>
	</div>
{/if}

{@render children()}
