<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { Settings, setSettings, type Currency } from '#lib/state/settings.svelte.js';

	let {
		label,
		currency = 'EUR',
		children
	}: { label: string; currency?: Currency; children: Snippet } = $props();

	// Instancia propia de este subárbol, publicada con context
	const settings = new Settings();
	// Solo valor inicial: después manda el <select>
	settings.currency = untrack(() => currency);
	setSettings(settings);
</script>

<div class="rounded-lg border border-ink-200 p-3">
	<label class="mb-2 flex items-center gap-2 text-sm text-ink-500">
		{label}
		<select bind:value={settings.currency} class="rounded-lg border border-ink-200 px-2 py-1">
			<option value="EUR">EUR</option>
			<option value="USD">USD</option>
		</select>
	</label>
	{@render children()}
</div>
