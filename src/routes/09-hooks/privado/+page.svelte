<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!-- Si no hay sesión, handle redirige antes de que esta página se cargue -->
<DemoCard title="Zona privada" description="Solo se llega con sesión: lo comprueba handle.">
	<p class="text-sm text-ink-900">Bienvenido, {data.user?.name}.</p>
</DemoCard>
