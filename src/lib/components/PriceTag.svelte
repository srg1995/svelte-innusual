<script lang="ts">
	import { getSettings } from '#lib/state/settings.svelte.js';

	let { amount }: { amount: number } = $props();

	// Sin props intermedias: busca el Settings del ancestro más cercano
	const settings = getSettings();
</script>

<p class="text-sm text-ink-900">{settings.format(amount)}</p>
