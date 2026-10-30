<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { page } from '$app/state';
</script>

<DemoCard title="Página «nuevo»" description="Renderizada por reroute desde /08-hooks/antiguo.">
	<p class="text-sm text-ink-900">
		URL en la barra: <code>{page.url.pathname}</code> · ruta renderizada:
		<code>{page.route.id}</code>
	</p>
</DemoCard>
