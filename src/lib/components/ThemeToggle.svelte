<script lang="ts">
	import { getTheme } from '#lib/state/theme.svelte.js';

	// El mismo contexto que lee ThemedBadge: aquí el Theme es el de la raíz, publicado por el layout
	const theme = getTheme();
	const dark = $derived(theme.name === 'oscuro');
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	aria-label={dark ? 'Cambiar al tema claro' : 'Cambiar al tema oscuro'}
	aria-pressed={dark}
	title={dark ? 'Tema claro' : 'Tema oscuro'}
	class="grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-surface text-innusual-ink transition hover:border-innusual-purple hover:text-innusual-purple"
>
	{#if dark}
		<svg
			viewBox="0 0 24 24"
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
			/>
		</svg>
	{:else}
		<svg
			viewBox="0 0 24 24"
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
		</svg>
	{/if}
</button>
