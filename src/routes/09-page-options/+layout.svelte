<script lang="ts">
	import type { LayoutProps } from './$types';
	import { base } from './paths';

	let { children }: LayoutProps = $props();
</script>

<main class="grid min-h-screen place-items-start justify-center bg-ink-50 p-8 pt-16">
	<div class="w-full max-w-xl space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">09 · Page options</h1>
			<p class="text-sm text-ink-500">
				Se exportan desde <code>+page.ts</code>, <code>+page.server.ts</code> o los layouts
			</p>
		</header>

		<nav class="flex flex-wrap gap-3 text-sm text-brand-600 underline">
			<a href={base}>Inicio</a>
			<a href="{base}/prerender">prerender</a>
			<a href="{base}/sin-ssr">ssr = false</a>
			<a href="{base}/sin-csr">csr = false</a>
			<a href="{base}/slash/">trailingSlash</a>
		</nav>

		{@render children()}
	</div>
</main>
