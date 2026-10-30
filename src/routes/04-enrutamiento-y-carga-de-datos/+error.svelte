<script lang="ts">
	import { page } from '$app/state';
	import { base } from './paths';
</script>

<!-- Se muestra dentro del layout de esta sección: lo lanzan error(404, ...) o un matcher que no coincide -->
<div class="rounded-lg bg-ink-100 p-4">
	<h2 class="text-lg font-semibold text-ink-900">{page.status}</h2>
	<p class="text-sm text-ink-500">{page.error?.message}</p>
	<a href={base} class="text-sm text-brand-600 underline">Volver al listado</a>
</div>
