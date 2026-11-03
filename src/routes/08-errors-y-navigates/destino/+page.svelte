<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { page } from '$app/state';
</script>

<DemoCard title="Destino" description="Página de llegada de goto y redirect.">
	<p class="text-sm text-ink-900">
		Query: <code>{page.url.search || '(vacía)'}</code>
	</p>
</DemoCard>
