<script lang="ts">
	type Example = { href: string; number: string; title: string; description: string };
	type Section = { title: string; description: string; examples: Example[] };

	// Una entrada por diapositiva: añadir aquí cada nueva página
	const sections: Section[] = [
		{
			title: 'Svelte',
			description: 'El framework: reactividad, binding y eventos.',
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
					href: '/03-eventos',
					number: '03',
					title: 'Eventos',
					description: 'Handlers, preventDefault, propagación, callback props y on().'
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

<div class="min-h-screen bg-white text-innusual-ink">
	<!-- La imagen ya incluye el logotipo; en pantallas estrechas se recorta por la izquierda -->
	<header class="relative">
		<img
			src="/brand/banner.jpg"
			alt="innusual"
			class="h-36 w-full object-cover object-right sm:h-auto"
		/>
		<div
			class="h-1.5 w-full bg-gradient-to-r from-innusual-coral via-innusual-rose via-40% to-innusual-purple"
		></div>
	</header>

	<main class="mx-auto max-w-5xl px-6 py-12">
		<div class="mb-12 max-w-2xl">
			<p class="mb-2 font-mono text-sm font-semibold tracking-wide text-innusual-coral">
				&gt;&gt; Presentación técnica
			</p>
			<h1 class="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">Svelte y SvelteKit</h1>
			<p class="text-lg text-ink-500">Guía práctica y rápida con ejemplos de Svelte y SvelteKit</p>
		</div>

		{#each sections as section (section.title)}
			<section class="mb-12">
				<div class="mb-5 flex items-baseline gap-3 border-b border-ink-200 pb-3">
					<h2 class="text-2xl font-semibold">
						<span class="font-mono text-innusual-coral">&gt;</span>{section.title}
					</h2>
					<p class="text-sm text-ink-500">{section.description}</p>
				</div>

				<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each section.examples as example (example.href)}
						<li>
							<a
								href={example.href}
								class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-innusual-purple hover:shadow-lg"
							>
								<span
									class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-innusual-teal via-innusual-purple to-innusual-rose opacity-0 transition group-hover:opacity-100"
								></span>
								<span
									class="mb-3 bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose bg-clip-text text-4xl font-bold text-transparent"
								>
									{example.number}
								</span>
								<span class="mb-1 text-lg leading-snug font-semibold">{example.title}</span>
								<span class="text-sm text-ink-500">{example.description}</span>
								<span
									class="mt-auto pt-4 text-sm font-medium text-innusual-purple transition group-hover:translate-x-1"
								>
									Saber más +
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</main>

	<footer class="border-t border-ink-200">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
			<img src="/brand/logo.png" alt="innusual" class="h-12 w-auto" />
			<p class="text-sm text-ink-500">
				© 2026 innusual. Ejemplos de la presentación de Svelte y SvelteKit.
			</p>
		</div>
	</footer>
</div>
