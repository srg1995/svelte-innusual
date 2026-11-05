<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!-- Sin sesión, handle redirige y, si no, lo hace el load de +page.server.ts: aquí user siempre existe -->
<DemoCard title="Zona privada" description="Solo se llega con sesión: lo comprueba handle.">
	<p class="text-sm text-ink-900">Bienvenido, {data.user.name}.</p>
</DemoCard>
