<script lang="ts">
	import { getTheme } from '#lib/state/theme.svelte.js';

	// Sin props: pregunta al contexto cuál es el tema del ancestro más cercano
	const theme = getTheme();
</script>

<p class="rounded-lg border px-3 py-1 text-sm {theme.classes}">
	Este componente lee el tema «{theme.name}»
</p>
