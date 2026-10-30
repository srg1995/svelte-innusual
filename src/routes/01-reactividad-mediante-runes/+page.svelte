<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { untrack } from 'svelte';
	import AddToCartButton from '#lib/components/AddToCartButton.svelte';
	import CartBadge from '#lib/components/CartBadge.svelte';
	import CurrencyProvider from '#lib/components/CurrencyProvider.svelte';
	import PriceTag from '#lib/components/PriceTag.svelte';
	import { cart } from '#lib/state/cart.svelte.js';

	type Item = { id: number; name: string; price: number; qty: number };

	// $state: estado reactivo. Los objetos y arrays son proxies profundos,
	// así que mutar (push, item.qty++) basta sin crear copias.
	let items = $state<Item[]>([
		{ id: 1, name: 'Camiseta', price: 15, qty: 1 },
		{ id: 2, name: 'Gorra', price: 10, qty: 2 }
	]);
	let discount = $state(0);

	// $derived: valor calculado que se recalcula solo cuando cambian sus dependencias.
	let subtotal = $derived(items.reduce((sum, i) => sum + i.price * i.qty, 0));
	let total = $derived(subtotal * (1 - discount / 100));

	// $derived.by: para derivaciones que necesitan más de una expresión.
	let summary = $derived.by(() => {
		const units = items.reduce((sum, i) => sum + i.qty, 0);
		return `${units} unidades en ${items.length} líneas`;
	});

	// $effect: efecto secundario que se ejecuta tras el DOM y se re-ejecuta
	// cuando cambia algo de lo que lee. Puede devolver una función de limpieza.
	let log = $state<string[]>([]);
	$effect(() => {
		const entry = `Total actualizado: ${total.toFixed(2)} €`;
		// untrack: push/shift leen `log`; sin él el efecto dependería de lo que escribe y entraría en bucle.
		untrack(() => {
			log.push(entry);
			if (log.length > 5) log.shift();
		});

		return () => console.log('limpieza antes de la siguiente ejecución');
	});

	let nextId = 3;
	function addItem() {
		items.push({ id: nextId++, name: `Producto ${nextId - 1}`, price: 5, qty: 1 });
	}
</script>

<SlideShell
	number="01"
	title="Reactividad mediante runes"
	description="$state, $derived y $effect, y cómo exportar estado compartido y context."
>
	<div class="grid gap-5 lg:grid-cols-2">
		<DemoCard
			title="$state, $derived y $effect"
			description="Un carrito: el total se recalcula solo y cada cambio queda registrado."
		>
			<ul class="space-y-2">
				{#each items as item (item.id)}
					<li class="flex items-center gap-3">
						<span class="w-28 text-ink-900">{item.name}</span>
						<span class="w-16 text-ink-500">{item.price} €</span>
						<!-- bind sobre una propiedad anidada: mutación directa del proxy -->
						<input
							type="number"
							min="0"
							bind:value={item.qty}
							class="w-20 rounded-lg border border-ink-200 px-2 py-1"
						/>
					</li>
				{/each}
			</ul>

			<button
				onclick={addItem}
				class="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white"
			>
				Añadir producto
			</button>

			<label class="block text-sm text-ink-500">
				Descuento: {discount} %
				<input type="range" min="0" max="50" bind:value={discount} class="w-full" />
			</label>

			<div class="rounded-lg bg-ink-50 p-4 text-sm text-ink-900">
				<p>Subtotal: {subtotal.toFixed(2)} €</p>
				<p class="font-semibold">Total: {total.toFixed(2)} €</p>
				<p class="text-ink-500">{summary}</p>
			</div>
		</DemoCard>

		<div class="space-y-5">
			<DemoCard
				title="Registro del $effect"
				description="Se ejecuta cada vez que cambia el total. Usa untrack para no depender de lo que escribe."
			>
				<ul class="text-xs text-ink-500">
					{#each log as entry, i (i)}
						<li>{entry}</li>
					{:else}
						<li>Sin entradas todavía.</li>
					{/each}
				</ul>
			</DemoCard>

			<DemoCard
				title="Estado compartido"
				description="Las runes funcionan en archivos .svelte.ts: el estado se exporta e importa desde cualquier componente, sin Provider ni props."
			>
				<div class="flex items-center justify-between">
					<div class="flex gap-2">
						<AddToCartButton name="Camiseta" price={15} />
						<AddToCartButton name="Gorra" price={10} />
					</div>
					<CartBadge />
				</div>
				<p class="text-sm text-ink-500">
					Total del carrito (leído desde la página): {cart.total} €
					<button onclick={() => cart.clear()} class="ml-2 underline">vaciar</button>
				</p>
			</DemoCard>
		</div>

		<DemoCard
			wide
			title="Context"
			description="Cuando el estado debe ser por subárbol (o por petición en SSR) se publica con createContext. Cada proveedor tiene su propia instancia."
		>
			<div class="grid gap-3 sm:grid-cols-2">
				<CurrencyProvider label="Tienda A">
					<PriceTag amount={cart.total} />
				</CurrencyProvider>
				<CurrencyProvider label="Tienda B">
					<PriceTag amount={cart.total} />
				</CurrencyProvider>
			</div>
		</DemoCard>
	</div>
</SlideShell>

<!--

Resumen: Svelte frente a React y Vue

1. Estado local, derivado y efecto
   - React: useState para el estado, useMemo para lo derivado y useEffect para los efectos. Hay que
     escribir a mano los arrays de dependencias (si te olvidas una, el fallo es silencioso) y
     actualizar siempre con copias nuevas (spread, map, filter), porque mutar no dispara el render.
   - Vue: ref, computed y watchEffect. Las dependencias se detectan solas y se puede mutar, pero hay
     que usar .value en el script y distinguir entre ref y reactive.
   - Svelte: $state, $derived y $effect. Se lee y se escribe como una variable normal, sin .value,
     sin arrays de dependencias y mutando directamente (items.push, item.qty++).

2. Estado compartido entre componentes
   - React: Context + Provider + un hook propio (useCart), con useMemo y useCallback para estabilizar
     el valor, o una librería externa (Zustand, Redux). Hay que envolver la app en el Provider y,
     cuando cambia el valor, se vuelven a renderizar todos los consumidores.
   - Vue: un composable con el estado declarado fuera de la función. Funciona bien, pero sigue
     arrastrando .value y la separación entre ref, reactive y computed.
   - Svelte: una clase con $state y $derived en un archivo .svelte.ts, exportada e importada donde
     haga falta. Sin Provider, sin hook y sin memoización. La reactividad es fina: solo se actualiza
     lo que lee ese valor concreto.

3. Context (estado por subárbol)
   - React: createContext con valor inicial null, Provider, useMemo para el valor y una comprobación
     de null en cada consumidor.
   - Vue: provide/inject con un InjectionKey tipado; inject puede devolver undefined y hay que
     comprobarlo.
   - Svelte: createContext devuelve el par [get, set] ya tipado. No necesita claves, ni valor inicial
     nulo, ni comprobaciones, ni memoización, y lanza un error claro si falta el proveedor.

Conclusión: las runes unifican en una sola idea (variables que reaccionan) lo que en React se reparte
entre varios hooks con reglas propias, y lo que en Vue se reparte entre ref, reactive y computed.

-->
