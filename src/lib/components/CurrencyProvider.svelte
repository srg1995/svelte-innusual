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
		<span class="relative">
			<select
				bind:value={settings.currency}
				class="appearance-none rounded-lg border border-ink-200 py-1 pr-8 pl-2"
			>
				<option value="EUR">EUR</option>
				<option value="USD">USD</option>
			</select>
		</span>
	</label>
	{@render children()}
</div>
