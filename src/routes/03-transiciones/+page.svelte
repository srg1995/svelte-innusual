<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';
	import { bounceOut, cubicOut, elasticOut, linear } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { Spring, Tween } from 'svelte/motion';

	// 1. transition: directiva bidireccional (entra y sale con la misma función).
	// Las funciones vienen incluidas en svelte/transition y se configuran con un objeto.
	let showBasics = $state(true);

	// 2. in: y out: por separado, con parámetros (duración, distancia, easing)
	const easings = { linear, cubicOut, elasticOut, bounceOut };
	type EasingName = keyof typeof easings;
	let showFly = $state(true);
	let easingName = $state<EasingName>('cubicOut');

	// 3. Eventos del ciclo de vida de la transición
	let showEvents = $state(true);
	let status = $state('Sin actividad');

	// 4. Transición personalizada: una función que devuelve { duration, tick }
	function typewriter(node: HTMLElement, { speed = 35 }: { speed?: number } = {}) {
		const text = node.textContent ?? '';
		return {
			duration: text.length * speed,
			tick: (t: number) => {
				node.textContent = text.slice(0, Math.trunc(text.length * t));
			}
		};
	}
	let showTypewriter = $state(true);

	// 5. Local (por defecto) frente a global: ¿se animan los hijos cuando se monta el bloque padre?
	let showLocal = $state(true);
	let showGlobal = $state(true);
	let nextItem = 4;
	let items = $state([1, 2, 3]);
	const addItem = () => items.push(nextItem++);
	const removeItem = () => items.pop();

	// 6. draw: dibuja un trazo SVG. {#key} vuelve a montar el bloque para repetir la intro.
	let drawRun = $state(0);

	// 7. crossfade + animate:flip: un elemento "viaja" de una lista a otra y el resto se recoloca
	type Task = { id: number; label: string; done: boolean };
	let tasks = $state<Task[]>([
		{ id: 1, label: 'Preparar la presentación', done: false },
		{ id: 2, label: 'Revisar los ejemplos', done: false },
		{ id: 3, label: 'Subir la PR', done: true }
	]);
	const pending = $derived(tasks.filter((t) => !t.done));
	const finished = $derived(tasks.filter((t) => t.done));
	// fallback: qué hacer si el elemento no tiene pareja en la otra lista
	const [send, receive] = crossfade({ duration: 400, fallback: (node) => scale(node) });

	// 8. Tween y Spring: valores que se animan solos hacia un objetivo
	const progress = new Tween(0, { duration: 500, easing: cubicOut });
	const ball = new Spring(0, { stiffness: 0.08, damping: 0.25 });
</script>

<SlideShell
	number="03"
	title="Transiciones"
	description="Animar la entrada y salida de elementos con transition:, in:, out:, crossfade y animate:."
>
	<div class="grid gap-5 lg:grid-cols-2">
		<DemoCard
			title="transition:"
			description="Una directiva y una función incluida: fade, fly, slide, scale y blur."
		>
			<button
				onclick={() => (showBasics = !showBasics)}
				class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
			>
				{showBasics ? 'Ocultar' : 'Mostrar'}
			</button>
			<div
				class="grid min-h-28 grid-cols-2 content-start gap-2 text-center text-xs text-white sm:grid-cols-3"
			>
				{#if showBasics}
					<div transition:fade class="rounded-lg bg-innusual-teal p-3">fade</div>
					<div transition:fly={{ y: 20 }} class="rounded-lg bg-innusual-purple p-3">fly</div>
					<div transition:slide class="rounded-lg bg-innusual-pink p-3">slide</div>
					<div transition:scale class="rounded-lg bg-innusual-orange p-3">scale</div>
					<div transition:blur={{ amount: 8 }} class="rounded-lg bg-innusual-coral p-3">blur</div>
				{/if}
			</div>
		</DemoCard>

		<DemoCard
			title="in: y out: con parámetros"
			description="Entra con fly (con el easing elegido) y sale con fade."
		>
			<div class="flex flex-wrap items-center gap-2 text-sm">
				<button
					onclick={() => (showFly = !showFly)}
					class="rounded-lg border border-ink-200 px-3 py-1"
				>
					{showFly ? 'Ocultar' : 'Mostrar'}
				</button>
				<select bind:value={easingName} class="rounded-lg border border-ink-200 px-2 py-1">
					{#each Object.keys(easings) as name (name)}
						<option>{name}</option>
					{/each}
				</select>
			</div>
			<div class="h-14 overflow-hidden">
				{#if showFly}
					<div
						in:fly={{ x: -120, duration: 800, easing: easings[easingName] }}
						out:fade={{ duration: 200 }}
						class="w-fit rounded-lg bg-innusual-purple px-4 py-3 text-sm text-white"
					>
						Easing: {easingName}
					</div>
				{/if}
			</div>
		</DemoCard>

		<DemoCard
			title="Eventos de la transición"
			description="onintrostart, onintroend, onoutrostart y onoutroend avisan del ciclo."
		>
			<button
				onclick={() => (showEvents = !showEvents)}
				class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
			>
				{showEvents ? 'Ocultar' : 'Mostrar'}
			</button>
			<div class="h-12">
				{#if showEvents}
					<div
						transition:fly={{ y: 16, duration: 600 }}
						onintrostart={() => (status = 'Entrando…')}
						onintroend={() => (status = 'Dentro')}
						onoutrostart={() => (status = 'Saliendo…')}
						onoutroend={() => (status = 'Fuera del DOM')}
						class="w-fit rounded-lg bg-innusual-teal px-4 py-3 text-sm text-white"
					>
						Elemento animado
					</div>
				{/if}
			</div>
			<p class="text-sm text-ink-500">Estado: {status}</p>
		</DemoCard>

		<DemoCard
			title="Transición personalizada"
			description="Una función que devuelve duration y tick(t): aquí, un efecto de máquina de escribir."
		>
			<button
				onclick={() => (showTypewriter = !showTypewriter)}
				class="rounded-lg border border-ink-200 px-3 py-1 text-sm"
			>
				{showTypewriter ? 'Ocultar' : 'Mostrar'}
			</button>
			<div class="h-6">
				{#if showTypewriter}
					<p transition:typewriter class="font-mono text-sm text-innusual-ink">
						Svelte genera la animación con JavaScript o CSS.
					</p>
				{/if}
			</div>
		</DemoCard>

		<DemoCard
			title="Local frente a global"
			description="Por defecto una transición solo se reproduce si su bloque inmediato entra o sale. Con |global también cuando lo hace un bloque padre."
		>
			<div class="flex flex-wrap gap-2 text-sm">
				<button onclick={addItem} class="rounded-lg border border-ink-200 px-3 py-1">
					Añadir elemento
				</button>
				<button onclick={removeItem} class="rounded-lg border border-ink-200 px-3 py-1">
					Quitar elemento
				</button>
			</div>
			<div class="grid gap-3 sm:grid-cols-2">
				<div>
					<label class="flex items-center gap-2 text-sm text-ink-500">
						<input type="checkbox" bind:checked={showLocal} /> Lista local
					</label>
					{#if showLocal}
						<ul class="mt-2 space-y-1 text-sm">
							{#each items as item (item)}
								<li transition:slide class="rounded-lg bg-ink-100 px-3 py-1">Elemento {item}</li>
							{/each}
						</ul>
					{/if}
				</div>
				<div>
					<label class="flex items-center gap-2 text-sm text-ink-500">
						<input type="checkbox" bind:checked={showGlobal} /> Lista global
					</label>
					{#if showGlobal}
						<ul class="mt-2 space-y-1 text-sm">
							{#each items as item (item)}
								<li transition:slide|global class="rounded-lg bg-ink-100 px-3 py-1">
									Elemento {item}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</DemoCard>

		<DemoCard
			title="draw"
			description="Dibuja un trazo SVG; al repetir se vuelve a montar el bloque con un key."
		>
			<button onclick={() => drawRun++} class="rounded-lg border border-ink-200 px-3 py-1 text-sm">
				Repetir
			</button>
			{#key drawRun}
				<svg
					viewBox="0 0 200 60"
					class="h-16 w-full"
					fill="none"
					stroke-width="4"
					stroke-linecap="round"
				>
					<path
						in:draw={{ duration: 1200 }}
						d="M10 40 C 40 -10, 70 -10, 100 30 S 160 70, 190 20"
						class="stroke-innusual-purple"
					/>
				</svg>
			{/key}
		</DemoCard>

		<DemoCard
			wide
			title="crossfade y animate:flip"
			description="Al marcar una tarea viaja de una lista a otra (send y receive) y las demás se recolocan con flip."
		>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each [{ title: 'Pendientes', list: pending, done: true }, { title: 'Hechas', list: finished, done: false }] as column (column.title)}
					<div>
						<h3 class="mb-2 text-sm font-semibold">{column.title}</h3>
						<ul class="space-y-1 text-sm">
							{#each column.list as task (task.id)}
								<li
									in:receive={{ key: task.id }}
									out:send={{ key: task.id }}
									animate:flip={{ duration: 300 }}
								>
									<label class="flex items-center gap-2 rounded-lg bg-ink-100 px-3 py-2">
										<input
											type="checkbox"
											checked={task.done}
											onchange={() => (task.done = column.done)}
										/>
										{task.label}
									</label>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</DemoCard>

		<DemoCard
			wide
			title="Tween y Spring"
			description="Valores que se animan solos hacia su objetivo: sin transiciones de CSS ni requestAnimationFrame a mano."
		>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-2">
					<div class="flex gap-2 text-sm">
						<button
							onclick={() => (progress.target = 0)}
							class="rounded-lg border border-ink-200 px-3 py-1"
						>
							0 %
						</button>
						<button
							onclick={() => (progress.target = 100)}
							class="rounded-lg border border-ink-200 px-3 py-1"
						>
							100 %
						</button>
					</div>
					<div class="h-3 overflow-hidden rounded-full bg-ink-100">
						<div
							class="h-full bg-gradient-to-r from-innusual-teal to-innusual-purple"
							style:width="{progress.current}%"
						></div>
					</div>
					<p class="text-sm text-ink-500">Tween: {progress.current.toFixed(0)} %</p>
				</div>
				<div class="space-y-2">
					<div class="flex gap-2 text-sm">
						<button
							onclick={() => (ball.target = 0)}
							class="rounded-lg border border-ink-200 px-3 py-1"
						>
							Izquierda
						</button>
						<button
							onclick={() => (ball.target = 100)}
							class="rounded-lg border border-ink-200 px-3 py-1"
						>
							Derecha
						</button>
					</div>
					<div class="h-8 rounded-full bg-ink-100 px-3">
						<div class="relative h-full">
							<div
								class="absolute top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-innusual-coral"
								style:left="{ball.current}%"
							></div>
						</div>
					</div>
					<p class="text-sm text-ink-500">Spring: rebota al llegar al objetivo.</p>
				</div>
			</div>
		</DemoCard>
	</div>
</SlideShell>

<!--

Resumen: Svelte frente a React y Vue

1. Entrada y salida de elementos (transition:, in:, out:)
   - React: no hay nada incluido. Al desmontar un componente el DOM desaparece al instante, así que
     animar la salida exige mantener el elemento vivo con estado propio, o usar una librería
     (react-transition-group o Framer Motion con AnimatePresence).
   - Vue: <Transition> y <TransitionGroup> vienen incluidos y funcionan con clases CSS
     (v-enter-from, v-enter-active, v-leave-to…) o con hooks de JavaScript. Hay que escribir el CSS
     de cada animación.
   - Svelte: una directiva sobre el elemento (transition:fade, in:fly, out:slide) y una función
     incluida en svelte/transition. Sin clases, sin CSS aparte y sin envolver el elemento.

2. Parámetros, easing y eventos
   - React: depende de la librería elegida.
   - Vue: duración y easing se escriben en el CSS; los eventos son hooks (@before-enter, @after-leave).
   - Svelte: se pasan como objeto ({ y: 20, duration: 800, easing: bounceOut }) y los avisos son
     atributos (onintrostart, onoutroend).

3. Transiciones personalizadas
   - React: se programan con la librería de animación o con CSS y estado.
   - Vue: con hooks de JavaScript (onEnter, onLeave) que reciben un callback done.
   - Svelte: una función que devuelve { duration, css } o { duration, tick }. Svelte genera la
     animación y la reproduce sola.

4. Listas y movimiento entre contenedores
   - React: Framer Motion (layout, layoutId) o una librería de FLIP; sin ellas, se hace a mano.
   - Vue: <TransitionGroup> con la clase v-move aplica FLIP, pero el viaje entre dos listas no está
     resuelto.
   - Svelte: animate:flip recoloca los elementos y crossfade (send y receive) los mueve de una lista
     a otra, ambos incluidos.

5. Valores animados
   - React: useSpring de Framer Motion o react-spring, o requestAnimationFrame dentro de un efecto.
   - Vue: librerías externas (VueUse con useTransition) o animar con CSS.
   - Svelte: Tween y Spring en svelte/motion, que se leen como un valor reactivo más (.current).

6. Alcance de la transición
   - Svelte: las transiciones son locales por defecto (solo se reproducen si su bloque inmediato
     entra o sale, así los hijos no se animan al montar toda la página); |global lo cambia.

Conclusión: React no trae animación de entrada y salida y obliga a una librería; Vue la trae pero basada
en clases CSS; Svelte la trae como directivas, con una biblioteca de funciones, easings, crossfade, flip y
valores animados, todo en el propio framework.

-->
