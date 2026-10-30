<script lang="ts">
	import { cart } from '#lib/state/cart.svelte.js';
</script>

<!-- Lee el estado compartido directamente: se actualiza cuando cualquier otro componente lo muta -->
<span class="rounded-full bg-brand-500 px-3 py-1 text-sm font-medium text-white">
	🛒 {cart.count}
</span>
