<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="space-y-1 text-sm">
	<h2 class="font-medium text-ink-900">trailingSlash = 'always'</h2>
	<p class="text-ink-500">URL actual: <code>{page.url.pathname}</code></p>
	<p class="text-xs text-ink-500">Prueba a quitar la barra final de la URL: te redirige.</p>
</section>
