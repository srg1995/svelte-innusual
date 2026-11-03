<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { page } from '$app/state';
</script>

<DemoCard
	title="trailingSlash = 'always'"
	description="Si la URL no coincide, SvelteKit redirige a la forma correcta."
>
	<p class="text-sm text-ink-500">URL actual: <code>{page.url.pathname}</code></p>
	<p class="text-xs text-ink-500">Prueba a quitar la barra final de la URL: te redirige.</p>
</DemoCard>
