<script lang="ts">
	import { page } from '$app/state';
</script>

<p class="text-sm text-ink-900">
	URL en la barra: <code>{page.url.pathname}</code> · ruta renderizada: <code>{page.route.id}</code>
</p>
