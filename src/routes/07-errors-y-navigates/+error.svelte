<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { page } from '$app/state';
	import { base } from './paths';
</script>

<!-- Se renderiza dentro del layout de la sección: la barra de navegación sigue visible -->
<DemoCard title="Error {page.status}" description={page.error?.message}>
	{#if page.error?.code}<p class="text-sm text-ink-500">Código: {page.error.code}</p>{/if}
	{#if page.error?.errorId}<p class="text-sm text-ink-500">
			Id para soporte: {page.error.errorId}
		</p>{/if}
	<a href={base} class="text-sm text-brand-600 underline">Volver al inicio de la sección</a>
</DemoCard>
