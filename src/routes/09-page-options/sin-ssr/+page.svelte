<script lang="ts">
	// Con ssr = false se puede usar window directamente, sin comprobar `browser`
	let width = $state(window.innerWidth);
</script>

<svelte:window bind:innerWidth={width} />

<section class="space-y-1 text-sm">
	<h2 class="font-medium text-ink-900">ssr = false</h2>
	<p class="text-ink-500">Ancho de ventana: <b class="text-ink-900">{width}px</b></p>
	<p class="text-xs text-ink-500">El HTML inicial del servidor no contiene este texto.</p>
</section>
