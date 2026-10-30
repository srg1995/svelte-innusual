<script lang="ts">
	// El "evento" del componente es simplemente una función que llega por props
	let { label, onconfirm }: { label: string; onconfirm: () => void } = $props();

	function handleClick() {
		if (confirm('¿Seguro?')) onconfirm();
	}
</script>

<button onclick={handleClick}>{label}</button>
