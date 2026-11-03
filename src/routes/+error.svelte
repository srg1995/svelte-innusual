<script lang="ts">
	import { page } from '$app/state';

	const notFound = $derived(page.status === 404);

	function goBack(event: MouseEvent) {
		if (history.length <= 1) return;
		event.preventDefault();
		history.back();
	}
</script>

<svelte:head>
	<title>{page.status} · innusual</title>
</svelte:head>

<!-- Error raíz: se muestra dentro del layout, así que conserva la barra con ← Home y el logotipo -->
<main
	class="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center"
>
	<div
		class="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose opacity-15 blur-3xl"
	></div>

	<p
		class="bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose bg-clip-text text-8xl leading-none font-bold tracking-tight text-transparent sm:text-9xl"
	>
		{page.status}
	</p>

	<h1 class="mt-6 text-2xl font-bold tracking-tight text-innusual-ink sm:text-3xl">
		{#if notFound}
			<span class="font-mono text-innusual-coral">&gt;</span> Esta página no existe
		{:else}
			<span class="font-mono text-innusual-coral">&gt;</span> Algo no ha salido bien
		{/if}
	</h1>

	<p class="mt-3 max-w-md text-ink-500">
		{#if notFound}
			La diapositiva que buscas no está o ha cambiado de sitio. Vuelve a la página anterior o elige
			un ejemplo desde la home.
		{:else}
			{page.error?.message ?? 'Ha ocurrido un error inesperado.'}
		{/if}
	</p>

	<div
		class="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-innusual-coral via-innusual-rose to-innusual-purple"
	></div>

	<a
		href="/"
		onclick={goBack}
		class="mt-8 rounded-full bg-innusual-purple px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
	>
		Volver atrás
	</a>

	{#if page.error?.errorId}
		<p class="mt-6 font-mono text-xs text-ink-500">Referencia: {page.error.errorId}</p>
	{/if}
</main>
