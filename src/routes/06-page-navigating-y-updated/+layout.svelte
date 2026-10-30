<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
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
	<div class="fixed inset-x-0 top-0 z-40 h-1 animate-pulse bg-brand-500"></div>
{/if}

<!-- updated.current pasa a true cuando SvelteKit detecta un despliegue nuevo -->
{#if updated.current}
	<div class="fixed inset-x-0 top-0 z-40 bg-brand-500 p-2 text-center text-sm text-white">
		Hay una versión nueva de la aplicación.
		<button onclick={() => location.reload()} class="ml-2 underline">Recargar</button>
	</div>
{/if}

<SlideShell
	number="06"
	title="page, navigating y updated"
	description="Estado reactivo del enrutador, importado de $app/state."
>
	<div class="grid gap-5 lg:grid-cols-2">
		<DemoCard
			title="Navega"
			description="Los valores de las otras tarjetas cambian sin recargar la página."
		>
			<nav class="flex flex-wrap gap-2 text-sm">
				<a
					href={base}
					class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
					>Inicio</a
				>
				<a
					href="{base}/42?color=rojo#detalle"
					class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
					>Con parámetro y query</a
				>
				<a
					href="{base}/lenta"
					class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
					>Carga lenta (1,5 s)</a
				>
				<a
					href="{base}/error"
					class="rounded-full border border-ink-200 bg-white px-3 py-1 text-brand-600 transition hover:border-innusual-purple"
					>Lanza un error</a
				>
			</nav>
			<div class="rounded-lg bg-ink-50 p-3">
				{@render children()}
			</div>
		</DemoCard>

		<DemoCard
			title="page"
			description="URL, parámetros, ruta, status, error y datos de la página actual."
		>
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
		</DemoCard>

		<DemoCard title="navigating" description="Solo tiene valor mientras dura una navegación.">
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
		</DemoCard>

		<DemoCard
			title="updated"
			description="Detecta si hay una versión nueva desplegada (solo en producción)."
		>
			<p class="text-sm text-ink-500">
				<code>updated.current</code>: {updated.current}
				<button onclick={checkForUpdate} class="ml-2 underline">updated.check()</button>
			</p>
			{#if checkResult}<p class="text-xs text-ink-500">{checkResult}</p>{/if}
		</DemoCard>
	</div>
</SlideShell>
