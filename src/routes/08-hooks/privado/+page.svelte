<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!-- Si no hay sesión, handle redirige antes de que esta página se cargue -->
<p class="text-sm text-ink-900">Zona privada. Bienvenido, {data.user?.name}.</p>
