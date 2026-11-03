<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	let count = $state(0);
</script>

<DemoCard title="csr = false" description="No se envía JavaScript: la página es HTML puro.">
	<button onclick={() => count++} class="rounded-lg border border-ink-200 px-3 py-1 text-sm">
		Contador: {count}
	</button>
	<p class="text-xs text-ink-500">
		El botón no hace nada porque el navegador no recibe JavaScript. Los enlaces y los formularios
		siguen funcionando como en una web tradicional.
	</p>
	<form method="GET" class="flex gap-2">
		<input
			name="q"
			placeholder="Formulario sin JS"
			class="w-full rounded-lg border border-ink-200 px-3 py-2"
		/>
		<button class="rounded-lg border border-ink-200 px-3 py-1 text-sm">Enviar</button>
	</form>
</DemoCard>
