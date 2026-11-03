<script lang="ts">
	import { page } from '$app/state';
</script>

<!-- page es reactivo: se actualiza solo al cambiar de parámetro o de query string -->
<p class="text-sm text-ink-900">
	Producto <b>{page.params.id}</b>, color:
	<b>{page.url.searchParams.get('color') ?? 'sin color'}</b>
</p>
