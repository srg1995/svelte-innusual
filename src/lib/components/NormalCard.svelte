<script lang="ts">
	interface Props {
		title?: string;
		step?: number;
	}
	let { title = 'Contador', step = 1 }: Props = $props();
	let count = $state(0);
	let name = $state('');
	let double = $derived(count * 2);

	$effect(() => console.log('count cambió:', count));
</script>

<div
	class="group w-full max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 dark:bg-ink-900"
>
	<h2 class="mb-3 text-2xl font-semibold text-ink-900 dark:text-white">{title}</h2>
	<input
		bind:value={name}
		placeholder="Tu nombre"
		class="mb-3 w-full rounded-lg border border-ink-200 px-3 py-2"
	/>
	<p class="mb-5 text-ink-500 dark:text-ink-400">
		Hola {name || 'anónimo'}: {count} (doble: {double})
	</p>
	<button class="button-primary" onclick={() => (count += step)}>
		Sumar {step}
		<span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
	</button>
</div>

<style>
	@reference "../../routes/layout.css";
	.button-primary {
		@apply inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white;
	}
</style>
