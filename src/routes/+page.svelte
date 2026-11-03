<script lang="ts">
	import CardCarousel from '#lib/components/CardCarousel.svelte';
	type Example = { href: string; number: string; title: string; description: string };
	type Section = { title: string; description: string; examples: Example[] };

	// Una entrada por diapositiva: añadir aquí cada nueva página
	const sections: Section[] = [
		{
			title: 'Svelte',
			description: 'El framework: reactividad, binding y transiciones.',
			examples: [
				{
					href: '/01-reactividad-mediante-runes',
					number: '01',
					title: 'Reactividad mediante runes',
					description: '$state, $derived, $effect, estado compartido y context.'
				},
				{
					href: '/02-binding',
					number: '02',
					title: 'Binding',
					description: 'bind:value, bind:group, bind:this, $bindable y function bindings.'
				},
				{
					href: '/03-transiciones',
					number: '03',
					title: 'Transiciones',
					description: 'transition:, in:, out:, crossfade, animate:flip, Tween y Spring.'
				}
			]
		},
		{
			title: 'SvelteKit',
			description: 'El meta-framework: rutas, datos, API, hooks y renderizado.',
			examples: [
				{
					href: '/04-enrutamiento-y-carga-de-datos',
					number: '04',
					title: 'Enrutamiento y carga de datos',
					description: 'Rutas por carpetas, layouts, load, matchers, streaming y errores.'
				},
				{
					href: '/05-endpoints-api-con-server-js',
					number: '05',
					title: 'Endpoints API con +server.js',
					description: 'Un handler por verbo HTTP, validación, params tipados y fetch interno.'
				},
				{
					href: '/06-page-navigating-y-updated',
					number: '06',
					title: 'page, navigating y updated',
					description: 'Estado reactivo del enrutador: URL, navegación en curso y nuevas versiones.'
				},
				{
					href: '/07-errors-y-navigates',
					number: '07',
					title: 'Errors y navigates',
					description: 'Errores esperados e inesperados, redirect, goto y ciclo de navegación.'
				},
				{
					href: '/08-hooks',
					number: '08',
					title: 'Hooks',
					description:
						'handle, handleFetch, handleError y reroute: lo transversal en un solo sitio.'
				},
				{
					href: '/09-page-options',
					number: '09',
					title: 'Page options',
					description: 'prerender, ssr, csr y trailingSlash, ruta a ruta.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>innusual · Svelte y SvelteKit</title>
</svelte:head>

<!-- Una sola pantalla: la página ocupa el alto del navegador y el pie queda abajo -->
<div class="flex min-h-dvh flex-col bg-white text-innusual-ink">
	<!-- La imagen ya incluye el logotipo; se recorta en alto y, en pantallas estrechas, por la izquierda -->
	<header>
		<img
			src="/brand/banner.jpg"
			alt="innusual"
			class="h-48 w-full object-cover object-[right_20%] sm:h-40"
		/>
		<div
			class="h-1 w-full bg-gradient-to-r from-innusual-coral via-innusual-rose via-40% to-innusual-purple"
		></div>
	</header>

	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-5">
		<h1 class="mb-5 text-3xl font-bold tracking-tight">Svelte y SvelteKit</h1>

		{#each sections as section (section.title)}
			<section class="mb-5">
				<CardCarousel items={section.examples} label={section.title}>
					{#snippet header()}
						<h2 class="text-xl font-semibold">
							<span class="font-mono text-innusual-coral">&gt;</span>{section.title}
						</h2>
						<p class="text-sm text-ink-500">{section.description}</p>
					{/snippet}
					{#snippet card(example)}
						<a
							href={example.href}
							class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-innusual-purple hover:shadow-lg"
						>
							<span
								class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-innusual-teal via-innusual-purple to-innusual-rose opacity-0 transition group-hover:opacity-100"
							></span>
							<span class="mb-1 flex items-baseline gap-3">
								<span
									class="bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose bg-clip-text text-3xl leading-none font-bold text-transparent"
								>
									{example.number}
								</span>
								<span class="text-base leading-snug font-semibold">{example.title}</span>
							</span>
							<span class="text-sm text-ink-500">{example.description}</span>
							<span
								class="mt-auto pt-2 text-sm font-medium text-innusual-purple transition group-hover:translate-x-1"
							>
								Saber más +
							</span>
						</a>
					{/snippet}
				</CardCarousel>
			</section>
		{/each}
	</main>

	<footer class="border-t border-ink-200">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
			<img src="/brand/logo.png" alt="innusual" class="h-9 w-auto" />
			<p class="text-right text-xs text-ink-500">
				© 2026 innusual. Presentación de Svelte y SvelteKit.<br />
				Desarrollado por Sergio Sacristán Santero.
			</p>
		</div>
	</footer>
</div>
