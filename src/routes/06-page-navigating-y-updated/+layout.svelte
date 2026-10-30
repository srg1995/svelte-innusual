<script lang="ts">
	import { navigating, page, updated } from '$app/state';
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	type NavSnapshot = { type: string; from: string; to: string; delta: number | null };

	let { children }: LayoutProps = $props();

	// `navigating` solo tiene valores mientras dura la navegación; para verla después la guardamos
	let lastNavigation = $state<NavSnapshot | null>(null);
	$effect(() => {
		if (!navigating.to) return;
		lastNavigation = {
			type: navigating.type,
			from: navigating.from?.url.pathname ?? '—',
			to: navigating.to.url.pathname,
			// delta solo existe en navegaciones popstate (atrás/adelante)
			delta: navigating.type === 'popstate' ? navigating.delta : null
		};
	});

	let checkResult = $state<string>('');
	async function checkForUpdate() {
		checkResult = 'Comprobando…';
		const hasUpdate = await updated.check();
		checkResult = hasUpdate ? 'Hay una versión nueva' : 'Estás en la última versión';
	}
</script>

<!-- navigating.to es null en reposo: sirve para una barra de progreso global -->
{#if navigating.to}
	<div class="fixed inset-x-0 top-0 z-20 h-1 animate-pulse bg-brand-500"></div>
{/if}

<!-- updated.current pasa a true cuando SvelteKit detecta un despliegue nuevo -->
{#if updated.current}
	<div class="fixed inset-x-0 top-0 z-20 bg-brand-500 p-2 text-center text-sm text-white">
		Hay una versión nueva de la aplicación.
		<button onclick={() => location.reload()} class="ml-2 underline">Recargar</button>
	</div>
{/if}

<main class="grid min-h-screen place-items-start justify-center bg-ink-50 p-8 pt-16">
	<div class="w-full max-w-xl space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">06 · page, navigating y updated</h1>
			<p class="text-sm text-ink-500">Estado reactivo de <code>$app/state</code></p>
		</header>

		<nav class="flex flex-wrap gap-3 text-sm text-brand-600 underline">
			<a href={base}>Inicio</a>
			<a href="{base}/42?color=rojo#detalle">Con parámetro y query</a>
			<a href="{base}/lenta">Carga lenta (1,5 s)</a>
			<a href="{base}/error">Lanza un error</a>
		</nav>

		{@render children()}

		<section class="space-y-1">
			<h2 class="text-sm font-medium text-ink-900">page</h2>
			<pre class="overflow-auto rounded-lg bg-ink-100 p-3 text-xs text-ink-900">{JSON.stringify(
					{
						'url.pathname': page.url.pathname,
						'url.search': page.url.search,
						'url.hash': page.url.hash,
						params: page.params,
						'route.id': page.route.id,
						status: page.status,
						error: page.error,
						data: page.data
					},
					null,
					2
				)}</pre>
		</section>

		<section class="space-y-1">
			<h2 class="text-sm font-medium text-ink-900">navigating</h2>
			<p class="text-sm text-ink-500">
				{#if navigating.to}
					Navegando de <code>{navigating.from?.url.pathname}</code> a
					<code>{navigating.to.url.pathname}</code> ({navigating.type})
				{:else}
					En reposo: <code>navigating.to</code> es <code>null</code>
				{/if}
			</p>
			{#if lastNavigation}
				<p class="text-xs text-ink-500">
					Última: {lastNavigation.type} · {lastNavigation.from} → {lastNavigation.to}
					{#if lastNavigation.delta !== null}· delta {lastNavigation.delta}{/if}
				</p>
			{/if}
		</section>

		<section class="space-y-1">
			<h2 class="text-sm font-medium text-ink-900">updated</h2>
			<p class="text-sm text-ink-500">
				<code>updated.current</code>: {updated.current}
				<button onclick={checkForUpdate} class="ml-2 underline">updated.check()</button>
			</p>
			{#if checkResult}<p class="text-xs text-ink-500">{checkResult}</p>{/if}
		</section>
	</div>
</main>
