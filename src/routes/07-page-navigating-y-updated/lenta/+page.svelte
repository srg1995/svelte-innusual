<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<p class="text-sm text-ink-900">{data.message}</p>
