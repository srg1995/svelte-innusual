<script lang="ts">
	let count = $state(0);
</script>

<section class="space-y-2 text-sm">
	<h2 class="font-medium text-ink-900">csr = false</h2>
	<button onclick={() => count++} class="rounded-lg border border-ink-200 px-3 py-1">
		Contador: {count}
	</button>
	<p class="text-xs text-ink-500">
		El botón no hace nada porque el navegador no recibe JavaScript. Los enlaces y los formularios
		siguen funcionando como en una web tradicional.
	</p>
	<form method="GET" class="flex gap-2">
		<input name="q" placeholder="Formulario sin JS" class="w-full rounded-lg border border-ink-200 px-3 py-2" />
		<button class="rounded-lg border border-ink-200 px-3 py-1">Enviar</button>
	</form>
</section>
