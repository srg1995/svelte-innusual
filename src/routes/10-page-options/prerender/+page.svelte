<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<DemoCard
	title="prerender = true"
	description="El HTML se genera una sola vez al ejecutar vite build."
>
	<p class="text-sm text-ink-500">Generada: <b class="text-ink-900">{data.generatedAt}</b></p>
	<p class="text-xs text-ink-500">
		En producción esta hora no cambia aunque recargues: es la de la compilación. En desarrollo no se
		aplica el prerender y la hora es la de cada petición.
	</p>
</DemoCard>
