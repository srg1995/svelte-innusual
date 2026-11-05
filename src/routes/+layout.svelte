<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { Theme, setTheme } from '#lib/state/theme.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// El tema de toda la aplicación es un contexto publicado desde la raíz: cualquier componente
	// puede leerlo con getTheme() sin recibir props.
	const theme = new Theme();
	setTheme(theme);

	// app.html ya aplicó el tema guardado antes de pintar; aquí solo se sincroniza el estado con él
	onMount(() => {
		theme.name = document.documentElement.dataset.theme === 'dark' ? 'oscuro' : 'claro';
	});

	$effect(() => {
		document.documentElement.dataset.theme = theme.name === 'oscuro' ? 'dark' : 'light';
		try {
			localStorage.setItem('innusual-theme', theme.name === 'oscuro' ? 'oscuro' : 'claro');
		} catch {
			// sin almacenamiento (modo privado): el tema solo dura mientras la pestaña esté abierta
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Barra común a todas las diapositivas: volver a la home y logotipo. La home lleva su propio banner -->
{#if page.route.id !== '/'}
	<div class="sticky top-0 z-30 border-b border-ink-200 bg-surface/85 backdrop-blur">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-2">
			<a
				href="/"
				class="rounded-full border border-ink-200 bg-surface px-4 py-1.5 text-sm font-medium text-innusual-ink transition hover:border-innusual-purple hover:text-innusual-purple"
			>
				← Home
			</a>
			<div class="flex items-center gap-3">
				<ThemeToggle />
				<img src="/brand/logo.png" alt="innusual" class="brand-logo h-9 w-auto" />
			</div>
		</div>
	</div>
{/if}

{@render children()}
