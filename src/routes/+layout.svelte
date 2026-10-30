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

<!-- Botón común a todas las diapositivas: se oculta en la propia home -->
{#if page.route.id !== '/'}
	<a
		href="/"
		class="fixed top-4 left-4 z-10 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-900 shadow-sm hover:border-brand-500"
	>
		← Home
	</a>
{/if}

<!-- Logotipo en las páginas interiores; la home ya lleva el banner de la empresa -->
{#if page.route.id !== '/'}
	<img src="/brand/logo.png" alt="innusual" class="fixed top-3 right-4 z-10 h-10 w-auto" />
{/if}

{@render children()}
