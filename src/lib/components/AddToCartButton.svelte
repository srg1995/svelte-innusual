<script lang="ts">
	import { cart } from '#lib/state/cart.svelte.js';

	let { name, price }: { name: string; price: number } = $props();
</script>

<button
	onclick={() => cart.add(name, price)}
	class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
>
	+ {name} ({price} €)
</button>
