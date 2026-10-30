<script lang="ts">
	import { page } from '$app/state';
</script>

<p class="text-sm text-ink-900">
	Estás en <code>destino</code>. Query: <code>{page.url.search || '(vacía)'}</code>
</p>
