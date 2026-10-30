<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Settings, setSettings } from '#lib/state/settings.svelte.js';

	let { label, children }: { label: string; children: Snippet } = $props();

	// Instancia propia de este subárbol, publicada con context
	const settings = new Settings();
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
