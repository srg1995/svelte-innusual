<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { Theme, setTheme, type ThemeName } from '#lib/state/theme.svelte.js';

	let {
		label,
		initial = 'claro',
		children
	}: { label: string; initial?: ThemeName; children: Snippet } = $props();

	// Cada proveedor crea su propio Theme y lo publica para todo su subárbol.
	// Si hay otro ThemeProvider dentro, ese subárbol usa el suyo y no el de este.
	const theme = new Theme(untrack(() => initial));
	setTheme(theme);
</script>

<div class="rounded-lg border p-3 {theme.classes}">
	<label class="mb-2 flex items-center gap-2 text-sm">
		{label}
		<select bind:value={theme.name} class="rounded-lg border border-ink-200 py-1 pl-2 text-ink-900">
			<option value="claro">claro</option>
			<option value="oscuro">oscuro</option>
			<option value="innusual">innusual</option>
		</select>
	</label>
	<div class="space-y-2">{@render children()}</div>
</div>
