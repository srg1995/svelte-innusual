<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	// Con ssr = false se puede usar window directamente, sin comprobar `browser`
	let width = $state(window.innerWidth);
</script>

<svelte:window bind:innerWidth={width} />

<DemoCard title="ssr = false" description="No se renderiza en el servidor: el HTML llega vacío.">
	<p class="text-sm text-ink-500">Ancho de ventana: <b class="text-ink-900">{width}px</b></p>
	<p class="text-xs text-ink-500">El HTML inicial del servidor no contiene este texto.</p>
</DemoCard>
