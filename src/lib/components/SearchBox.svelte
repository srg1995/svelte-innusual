<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// Eventos de componente = callback props. Aquí con payload tipado.
	// Además aceptamos el resto de atributos del <input> y los reenviamos con {...rest}:
	// así onfocus, onblur, etc. llegan al elemento sin declararlos uno a uno.
	let {
		onsearch,
		...rest
	}: { onsearch: (term: string) => void } & HTMLInputAttributes = $props();

	let term = $state('');
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		onsearch(term);
	}}
	class="flex gap-2"
>
	<input
		bind:value={term}
		{...rest}
		class="w-full rounded-lg border border-ink-200 px-3 py-2"
	/>
	<button class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">Buscar</button>
</form>
