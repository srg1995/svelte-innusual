<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section class="space-y-1 text-sm">
	<h2 class="font-medium text-ink-900">prerender = true</h2>
	<p class="text-ink-500">Generada: <b class="text-ink-900">{data.generatedAt}</b></p>
	<p class="text-xs text-ink-500">
		En producción esta hora no cambia aunque recargues: es la de la compilación. En desarrollo no se
		aplica el prerender y la hora es la de cada petición.
	</p>
</section>
