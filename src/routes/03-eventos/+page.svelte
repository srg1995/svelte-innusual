<script lang="ts">
	import { on } from 'svelte/events';
	import ConfirmButton from '#lib/components/ConfirmButton.svelte';
	import SearchBox from '#lib/components/SearchBox.svelte';

	type LogEntry = { id: number; msg: string };

	let log = $state<LogEntry[]>([]);
	let nextId = 0;
	const add = (msg: string) => (log = [{ id: nextId++, msg }, ...log].slice(0, 8));

	let count = $state(0);
	let mouse = $state({ x: 0, y: 0 });
	let modalOpen = $state(true);
	let email = $state('');

	// 1. Handler como función con nombre: recibe el evento tipado del DOM
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault(); // en Svelte 5 no hay modificadores |preventDefault: se hace a mano
		add(`Formulario enviado: ${email}`);
		email = '';
	}

	// 2. Atajo de shorthand: si la variable se llama como el evento, basta {onclick}
	const onclick = () => count++;

	// 3. Teclado
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') add('Enter');
		if (e.key === 'Escape') email = '';
	}

	// 4. Fase de captura: onclickcapture se ejecuta antes que el click del hijo
	// 5. Listener programático con `on` (devuelve la función para quitarlo)
	let target = $state<HTMLButtonElement | null>(null);
	$effect(() => {
		if (!target) return;
		// { once: true } y { passive: true } no existen como modificadores: se pasan como opciones
		return on(target, 'click', () => add('Listener con on() y limpieza automática'));
	});
</script>

<!-- Eventos de window/document: se limpian solos al destruir el componente -->
<svelte:window
	onkeydown={(e) => {
		if (e.ctrlKey && e.key === 'k') {
			e.preventDefault();
			add('Atajo global Ctrl + K');
		}
	}}
/>

<main class="grid min-h-screen place-items-center bg-ink-50 p-8">
	<div class="w-full max-w-xl space-y-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">03 · Eventos</h1>
			<p class="text-sm text-ink-500">
				En Svelte 5 los eventos son atributos: <code>onclick</code>, <code>onsubmit</code>…
			</p>
		</header>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Click: inline, shorthand y listener con on()</h2>
			<div class="flex flex-wrap gap-2 text-sm">
				<button onclick={() => add('Click inline')} class="rounded-lg border border-ink-200 px-3 py-1">
					Inline
				</button>
				<button {onclick} class="rounded-lg border border-ink-200 px-3 py-1">
					Shorthand: {count}
				</button>
				<button bind:this={target} class="rounded-lg border border-ink-200 px-3 py-1">
					on()
				</button>
			</div>
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Formulario y teclado (preventDefault)</h2>
			<form onsubmit={handleSubmit} class="flex gap-2">
				<input
					bind:value={email}
					onkeydown={handleKey}
					placeholder="Email (Enter / Esc)"
					class="w-full rounded-lg border border-ink-200 px-3 py-2"
				/>
				<button class="rounded-lg border border-ink-200 px-3 py-1 text-sm">Enviar</button>
			</form>
			<a
				href="https://svelte.dev"
				onclick={(e) => {
					e.preventDefault();
					add('Enlace pulsado sin navegar');
				}}
				class="text-sm text-brand-600 underline"
			>
				Enlace que no navega
			</a>
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Propagación: stopPropagation y captura</h2>
			{#if modalOpen}
				<div
					onclick={() => (modalOpen = false)}
					onclickcapture={() => add('Captura: el padre ve el click primero')}
					role="presentation"
					class="rounded-lg bg-ink-100 p-4 text-sm text-ink-500"
				>
					Fondo (click aquí lo cierra)
					<button
						onclick={(e) => {
							e.stopPropagation();
							add('Click dentro: no cierra el fondo');
						}}
						class="ml-2 rounded-lg border border-ink-200 bg-white px-3 py-1"
					>
						Dentro
					</button>
				</div>
			{:else}
				<button
					onclick={() => (modalOpen = true)}
					class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
				>
					Reabrir
				</button>
			{/if}
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Objeto del evento (mousemove)</h2>
			<div
				onmousemove={(e) => (mouse = { x: e.offsetX, y: e.offsetY })}
				role="presentation"
				class="grid h-20 place-items-center rounded-lg border border-ink-200 text-sm text-ink-500"
			>
				x: {mouse.x} · y: {mouse.y}
			</div>
		</section>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Eventos de componente: callback props</h2>
			<SearchBox
				placeholder="Buscar… (reenvía onfocus)"
				onfocus={() => add('Foco reenviado al input interno')}
				onsearch={(term) => add(`Búsqueda: «${term}»`)}
			/>
			<ConfirmButton label="Vaciar registro" onconfirm={() => (log = [])} />
		</section>

		<section>
			<h2 class="mb-1 text-sm font-medium text-ink-900">Registro</h2>
			<ul class="text-xs text-ink-500">
				{#each log as item (item.id)}<li>{item.msg}</li>{/each}
			</ul>
		</section>
	</div>
</main>

<!--

Resumen: Svelte frente a React y Vue

1. Cómo se declaran los eventos
   - React: atributos en camelCase (onClick, onSubmit) sobre eventos sintéticos propios de React.
   - Vue: la directiva @click (o v-on:click).
   - Svelte 5: atributos con el nombre del evento del DOM en minúsculas (onclick, onsubmit). Son
     propiedades normales, así que se pueden pasar, reenviar y usar con shorthand ({onclick}).

2. preventDefault, stopPropagation y fase de captura
   - React: se llama a mano sobre el evento (e.preventDefault()); la captura se activa con
     onClickCapture.
   - Vue: modificadores en la plantilla (@submit.prevent, @click.stop, .capture, .once, .passive).
     Es la opción más cómoda para este caso.
   - Svelte 5: no hay modificadores; se llama a mano igual que en React y la captura se activa con
     onclickcapture. Es más explícito, pero aquí Vue es más corto.

3. Eventos de window y document
   - React: addEventListener dentro de un useEffect, con su función de limpieza y su array de
     dependencias.
   - Vue: addEventListener en onMounted y removeEventListener en onUnmounted.
   - Svelte: <svelte:window onkeydown={...}>. Se registra y se limpia solo con el componente. Para
     listeners programáticos, on() de svelte/events devuelve la función para quitarlo.

4. Eventos de componente
   - React: callback props (onSearch, onConfirm), igual que en Svelte.
   - Vue: el hijo declara defineEmits y hace emit('search', term); el padre escucha con @search.
   - Svelte 5: también callback props, con payload tipado. createEventDispatcher queda obsoleto.

5. Reenviar eventos y atributos al elemento interno
   - React: hay que declarar cada prop o usar ...rest, tipando con ComponentProps<'input'>.
   - Vue: los atributos y listeners no declarados pasan solos al elemento raíz ($attrs).
   - Svelte: ...rest con HTMLInputAttributes y {...rest} sobre el elemento, controlando dónde
     aterrizan.

Conclusión: en el modelo de eventos Svelte 5 se parece a React (atributos y callbacks), y Vue gana
en modificadores y en reenvío automático. La ventaja de Svelte está en la limpieza automática de los
listeners globales y en que un evento es una prop más.

-->
