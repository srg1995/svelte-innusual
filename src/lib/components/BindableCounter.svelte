<script lang="ts">
	// $bindable: permite que el padre use bind:value sobre esta prop.
	let { value = $bindable(0), label }: { value?: number; label: string } = $props();
</script>

<div class="flex items-center gap-3">
	<span class="text-sm text-ink-500">{label}</span>
	<button onclick={() => value--} class="rounded-lg border border-ink-200 px-3 py-1">−</button>
	<span class="w-8 text-center text-ink-900">{value}</span>
	<button onclick={() => value++} class="rounded-lg border border-ink-200 px-3 py-1">+</button>
</div>
