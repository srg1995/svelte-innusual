<script lang="ts">
	import ConfirmButton from './ConfirmButton.svelte';

	type LogEntry = { id: number; msg: string };

	let log = $state<LogEntry[]>([]);
	let nextId = 0;
	let email = $state('');
	let mouse = $state({ x: 0, y: 0 });
	let open = $state(true);

	const add = (msg: string) => (log = [{ id: nextId++, msg }, ...log].slice(0, 6));

	// 1. Formulario: evitar que la página se recargue
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		add(`Formulario enviado: ${email}`);
		email = '';
	}

	// 2. Enlace: evitar que navegue
	function handleLink(e: MouseEvent) {
		e.preventDefault();
		add('Enlace pulsado, pero sin navegar');
	}

	// 3. Teclado
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') add('Has pulsado Enter');
		if (e.key === 'Escape') email = '';
	}

	// 4. Atajo global con la ventana
	function handleGlobalKey(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === 'k') {
			e.preventDefault(); // evita el atajo del navegador
			add('Atajo Ctrl + K');
		}
	}
</script>

<!-- 4. Eventos de la ventana completa -->
<svelte:window onkeydown={handleGlobalKey} />

<div class="max-w-md space-y-4 p-6">
	<!-- Click con parámetro -->
	<button onclick={() => add('Click en el botón')}>Click simple</button>

	<!-- 1. Submit + preventDefault -->
	<form onsubmit={handleSubmit}>
		<input bind:value={email} onkeydown={handleKey} placeholder="Email (Enter / Esc)" />
		<button>Enviar</button>
	</form>

	<!-- 2. Enlace + preventDefault -->
	<a href="https://svelte.dev" onclick={handleLink}>Enlace que no navega</a>

	<!-- 5. stopPropagation: el click del botón no llega al div padre -->
	{#if open}
		<div class="rounded-lg bg-ink-200 p-4" onclick={() => (open = false)} role="presentation">
			Fondo del modal (click aquí lo cierra)
			<button
				onclick={(e) => {
					e.stopPropagation();
					add('Click dentro, el modal sigue abierto');
				}}
			>
				Botón dentro del modal
			</button>
		</div>
	{:else}
		<button onclick={() => (open = true)}>Abrir modal</button>
	{/if}

	<!-- 6. Eventos de ratón: el objeto del evento trae información -->
	<div
		class="h-24 rounded-lg border"
		onmousemove={(e) => (mouse = { x: e.offsetX, y: e.offsetY })}
		role="presentation"
	>
		Ratón: {mouse.x}, {mouse.y}
	</div>

	<!-- 7. Eventos de componente: callback props -->
	<ConfirmButton label="Borrar todo" onconfirm={() => (log = [])} />

	<ul>
		{#each log as item (item.id)}<li>{item.msg}</li>{/each}
	</ul>
</div>
