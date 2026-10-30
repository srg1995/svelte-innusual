<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import BindableCounter from '#lib/components/BindableCounter.svelte';

	// bind:value / bind:checked: sincronización bidireccional con inputs
	let name = $state('');
	let accepted = $state(false);
	let age = $state(18);

	// bind:group: radios (un valor) y checkboxes (array)
	let size = $state<'S' | 'M' | 'L'>('M');
	let extras = $state<string[]>([]);

	// bind:value en select y textarea
	let country = $state('es');
	let notes = $state('');

	// bind:this: referencia al elemento del DOM (null hasta que se monta)
	let nameInput = $state<HTMLInputElement | null>(null);

	// bind:clientWidth: propiedades de solo lectura del elemento
	let boxWidth = $state(0);

	// bind: sobre una prop $bindable de un componente hijo
	let units = $state(1);

	// Function bindings: bind:value={get, set} para transformar el valor
	let celsius = $state(20);
	const toFahrenheit = () => Math.round((celsius * 9) / 5 + 32);
	const setFromFahrenheit = (f: number) => {
		celsius = Math.round(((f - 32) * 5) / 9);
	};
</script>

<SlideShell
	number="02"
	title="Binding"
	description="Sincronización bidireccional entre el estado y el DOM con bind:."
>
	<div class="grid gap-5 lg:grid-cols-2">
		<DemoCard
			title="bind:value · bind:checked · bind:this"
			description="Inputs de texto, checkbox y range, y una referencia al elemento."
		>
			<input
				bind:this={nameInput}
				bind:value={name}
				placeholder="Tu nombre"
				class="w-full rounded-lg border border-ink-200 px-3 py-2"
			/>
			<button
				onclick={() => nameInput?.focus()}
				class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
			>
				Enfocar input
			</button>
			<label class="flex items-center gap-2 text-sm text-ink-500">
				<input type="checkbox" bind:checked={accepted} /> Acepto las condiciones
			</label>
			<input type="range" min="0" max="99" bind:value={age} class="w-full" />
			<p class="text-sm text-ink-500">
				Hola «{name || '...'}», {age} años, {accepted ? 'acepta' : 'no acepta'}.
			</p>
		</DemoCard>

		<DemoCard title="bind:group" description="Radios (un valor) y checkboxes (un array).">
			<div class="flex gap-4 text-sm text-ink-500">
				{#each ['S', 'M', 'L'] as const as s (s)}
					<label><input type="radio" name="size" value={s} bind:group={size} /> {s}</label>
				{/each}
			</div>
			<div class="flex gap-4 text-sm text-ink-500">
				{#each ['Bolsa', 'Regalo', 'Seguro'] as extra (extra)}
					<label><input type="checkbox" value={extra} bind:group={extras} /> {extra}</label>
				{/each}
			</div>
			<p class="text-sm text-ink-500">Talla {size}, extras: {extras.join(', ') || 'ninguno'}</p>
		</DemoCard>

		<DemoCard title="select y textarea">
			<select bind:value={country} class="w-full rounded-lg border border-ink-200 px-3 py-2">
				<option value="es">España</option>
				<option value="fr">Francia</option>
				<option value="pt">Portugal</option>
			</select>
			<textarea
				bind:value={notes}
				rows="2"
				placeholder="Notas"
				class="w-full rounded-lg border border-ink-200 px-3 py-2"></textarea>
			<p class="text-sm text-ink-500">{country} · {notes.length} caracteres</p>
		</DemoCard>

		<DemoCard title="bind:clientWidth" description="Propiedades de solo lectura del elemento.">
			<div bind:clientWidth={boxWidth} class="resize-x overflow-auto rounded-lg bg-ink-100 p-3">
				<p class="text-sm text-ink-500">Redimensióname: {boxWidth}px</p>
			</div>
		</DemoCard>

		<DemoCard
			title="bind: con un componente hijo"
			description="La prop del hijo se declara con $bindable."
		>
			<BindableCounter label="Unidades" bind:value={units} />
			<p class="text-sm text-ink-500">El padre ve: {units}</p>
		</DemoCard>

		<DemoCard
			title="Function bindings"
			description="bind:value con un par get/set transforma el valor al leerlo y al escribirlo."
		>
			<label class="flex items-center gap-2 text-sm text-ink-500">
				°C <input
					type="number"
					bind:value={celsius}
					class="w-24 rounded-lg border border-ink-200 px-2 py-1"
				/>
			</label>
			<label class="flex items-center gap-2 text-sm text-ink-500">
				°F <input
					type="number"
					bind:value={toFahrenheit, setFromFahrenheit}
					class="w-24 rounded-lg border border-ink-200 px-2 py-1"
				/>
			</label>
		</DemoCard>
	</div>
</SlideShell>

<!--

Resumen: Svelte frente a React y Vue

1. Inputs de texto, checkbox, select y textarea
   - React: no existe el binding bidireccional. Cada campo es un "input controlado": hay que pasar
     value (o checked) y un onChange que llame al setter del useState, uno por campo.
   - Vue: v-model hace lo mismo que bind:value, con modificadores como .number, .trim y .lazy.
   - Svelte: bind:value y bind:checked. Una sola directiva, sin handler, y los inputs numéricos ya
     devuelven un number.

2. Grupos de radios y checkboxes
   - React: hay que comparar cada radio con el estado (checked={size === s}) y, en los checkboxes,
     construir a mano el array nuevo al marcar y desmarcar.
   - Vue: v-model sobre un mismo array o valor. Muy parecido a Svelte.
   - Svelte: bind:group rellena un valor (radios) o un array (checkboxes) automáticamente.

3. Referencias al DOM y medidas
   - React: useRef y acceder a ref.current; para conocer el ancho de un elemento hay que montar un
     ResizeObserver dentro de un useEffect con su limpieza.
   - Vue: ref de plantilla; para el ancho también hace falta un ResizeObserver o una utilidad
     externa (VueUse).
   - Svelte: bind:this para el elemento y bind:clientWidth (y similares) para medidas de solo
     lectura, sin código extra.

4. Binding con componentes hijos
   - React: el flujo es siempre unidireccional; el padre pasa value y onChange y el hijo los llama.
   - Vue: v-model en el componente, con defineModel() en el hijo para declararlo.
   - Svelte: el hijo marca la prop con $bindable y el padre usa bind:value. El hijo puede asignar
     directamente a la prop.

5. Transformar el valor (function bindings)
   - React: se resuelve a mano en value y onChange de cada campo.
   - Vue: se usa un computed con get y set, o modificadores limitados.
   - Svelte: bind:value={get, set} aplica la transformación en la propia directiva.

Conclusión: React obliga a escribir el cableado (value + onChange) en cada campo; Vue y Svelte lo
resuelven con una directiva, y Svelte la extiende a medidas del DOM y a la transformación del valor.

-->
