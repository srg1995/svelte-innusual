<script lang="ts">
	let { name = 'Camiseta', price = 15 }: { name?: string; price?: number } = $props();

	let quantity = $state(1);
	let total = $derived(quantity * price);

	$effect(() => console.log(`Total: ${total} €`));
</script>

<div class="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
	<h2 class="mb-3 text-2xl font-semibold text-ink-900">{name} · {price} €</h2>
	<input
		type="number"
		min="1"
		bind:value={quantity}
		class="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2"
	/>
	<p class="mb-5 text-ink-500">Total: {total} €</p>
	<button
		onclick={() => quantity++}
		class="rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white"
	>
		Añadir uno más
	</button>
</div>
