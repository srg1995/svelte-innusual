<script lang="ts">
	import { page } from '$app/state';
	import { base } from './paths';
</script>

<!-- Se renderiza dentro del layout de la sección: la barra de navegación sigue visible -->
<div class="space-y-1 rounded-lg bg-ink-100 p-4">
	<h2 class="text-lg font-semibold text-ink-900">Error {page.status}</h2>
	<p class="text-sm text-ink-900">{page.error?.message}</p>
	{#if page.error?.code}<p class="text-xs text-ink-500">Código: {page.error.code}</p>{/if}
	{#if page.error?.errorId}<p class="text-xs text-ink-500">Id para soporte: {page.error.errorId}</p>{/if}
	<a href={base} class="text-sm text-brand-600 underline">Volver al inicio de la sección</a>
</div>
