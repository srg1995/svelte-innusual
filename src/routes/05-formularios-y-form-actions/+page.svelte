<script lang="ts">
	import SlideShell from '#lib/components/SlideShell.svelte';
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// `form` es lo que devolvió la última action (return o fail). Cada formulario mira solo lo suyo.
	const plain = $derived(form?.which === 'plain' ? form : null);
	const fast = $derived(form?.which === 'enhanced' ? form : null);
	const added = $derived(form?.which === 'add' ? form : null);
	const failedRow = $derived(form?.which === 'like' || form?.which === 'remove' ? form : null);

	let log = $state<string[]>([]);
	const add = (msg: string) => (log = [msg, ...log].slice(0, 8));

	// use:enhance recibe una función que se ejecuta al enviar y devuelve otra que se ejecuta con la respuesta
	let submitting = $state(false);
	const onSubscribe: SubmitFunction = () => {
		submitting = true;
		add('enhance: enviando…');
		return async ({ result, update }) => {
			add(`enhance: respuesta «${result.type}»`);
			submitting = false;
			// update() hace lo de siempre: actualiza `form`, invalida los datos y resetea si hubo éxito
			await update();
		};
	};

	// cancel() aborta el envío: aquí, una validación en el cliente antes de molestar al servidor
	const onAdd: SubmitFunction = ({ formData, cancel }) => {
		if (String(formData.get('text')).trim() === '') {
			add('add: cancelado en el cliente (texto vacío)');
			cancel();
			return;
		}
		return async ({ result, update }) => {
			add(`add: respuesta «${result.type}»`);
			await update();
		};
	};

	// Sin reset: el campo del formulario no se toca al actualizar la lista
	const onRow: SubmitFunction = ({ action }) => {
		const name = action.search.replace('?/', '');
		return async ({ result, update }) => {
			add(`${name}: respuesta «${result.type}»`);
			await update({ reset: false });
		};
	};

	const input = 'w-full rounded-lg border border-ink-200 px-3 py-2';
	const button =
		'rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50';
	const ghost = 'rounded-lg border border-ink-200 px-3 py-1 text-sm';
</script>

<SlideShell
	number="05"
	title="Formularios y form actions"
	description="Un <form> normal enviado a una action del servidor, mejorado con use:enhance."
>
	<div class="grid gap-5 lg:grid-cols-2">
		<DemoCard
			title="Sin JavaScript"
			description="Un <form method=&quot;POST&quot;> y una action en +page.server.ts. La página se recarga, y fail() devuelve los errores y lo escrito."
		>
			<form method="POST" action="?/plain" class="space-y-3">
				<label class="block text-sm text-ink-500">
					Nombre
					<input name="name" value={plain?.values?.name ?? ''} class={input} />
					{#if plain?.errors?.name}<span class="text-xs text-innusual-coral"
							>{plain.errors.name}</span
						>{/if}
				</label>
				<label class="block text-sm text-ink-500">
					Email
					<input name="email" value={plain?.values?.email ?? ''} class={input} />
					{#if plain?.errors?.email}<span class="text-xs text-innusual-coral"
							>{plain.errors.email}</span
						>{/if}
				</label>
				<label class="block text-sm text-ink-500">
					Plan
					<select name="plan" class={input}>
						<option value="free" selected={plain?.values?.plan !== 'pro'}>Gratuito</option>
						<option value="pro" selected={plain?.values?.plan === 'pro'}>Pro</option>
					</select>
				</label>
				<button class={button}>Suscribirme</button>
				{#if plain?.success}
					<p class="text-sm text-innusual-teal">¡Suscrito, {plain.values.name}!</p>
				{/if}
			</form>
		</DemoCard>

		<DemoCard
			title="Con use:enhance"
			description="El mismo formulario y la misma action, pero con fetch: sin recarga, con estado «enviando» y sin perder el foco."
		>
			<form method="POST" action="?/enhanced" use:enhance={onSubscribe} class="space-y-3">
				<label class="block text-sm text-ink-500">
					Nombre
					<input name="name" value={fast?.values?.name ?? ''} class={input} />
					{#if fast?.errors?.name}<span class="text-xs text-innusual-coral">{fast.errors.name}</span
						>{/if}
				</label>
				<label class="block text-sm text-ink-500">
					Email
					<input name="email" value={fast?.values?.email ?? ''} class={input} />
					{#if fast?.errors?.email}<span class="text-xs text-innusual-coral"
							>{fast.errors.email}</span
						>{/if}
				</label>
				<label class="block text-sm text-ink-500">
					Plan
					<select name="plan" class={input}>
						<option value="free">Gratuito</option>
						<option value="pro">Pro</option>
					</select>
				</label>
				<button disabled={submitting} class={button}>
					{submitting ? 'Enviando…' : 'Suscribirme'}
				</button>
				{#if fast?.success}
					<p class="text-sm text-innusual-teal">¡Suscrito, {fast.values.name}!</p>
				{/if}
			</form>
		</DemoCard>

		<DemoCard
			wide
			title="Acciones con nombre"
			description="Varias actions en una misma página: ?/add, ?/like y ?/remove. Un botón elige la suya con formaction."
		>
			<form method="POST" action="?/add" use:enhance={onAdd} class="flex gap-2">
				<input name="text" placeholder="Escribe un mensaje" class={input} />
				<button class={button}>Añadir</button>
			</form>
			{#if added?.error}<p class="text-xs text-innusual-coral">{added.error}</p>{/if}

			<ul class="space-y-2">
				{#each data.messages as message (message.id)}
					<li>
						<form
							method="POST"
							use:enhance={onRow}
							class="flex items-center justify-between gap-2 rounded-lg bg-ink-100 px-3 py-2 text-sm"
						>
							<input type="hidden" name="id" value={message.id} />
							<span>{message.text}</span>
							<span class="flex shrink-0 gap-2">
								<button formaction="?/like" class={ghost}>♥ {message.likes}</button>
								<button formaction="?/remove" class={ghost}>Borrar</button>
							</span>
						</form>
					</li>
				{:else}
					<li class="text-sm text-ink-500">No hay mensajes.</li>
				{/each}
			</ul>
			{#if failedRow?.error}<p class="text-xs text-innusual-coral">{failedRow.error}</p>{/if}
		</DemoCard>

		<DemoCard
			wide
			title="Ciclo de use:enhance"
			description="Lo que ocurre en el cliente: envío, cancelación y tipo de resultado (success, failure, redirect, error)."
		>
			<ul class="text-xs text-ink-500">
				{#each log as entry, i (i)}<li>{entry}</li>{:else}<li>Sin envíos todavía.</li>{/each}
			</ul>
		</DemoCard>
	</div>
</SlideShell>

<!--

Resumen: SvelteKit frente a React/Next y Vue/Nuxt

1. Enviar un formulario al servidor
   - React: un formulario controlado (useState por campo) o no controlado, un onSubmit con
     preventDefault y un fetch escrito a mano hacia un endpoint. Si falla el JavaScript, el
     formulario no hace nada.
   - Next.js: Server Actions ('use server') con <form action={fn}>, que sí funcionan sin JavaScript;
     el estado de la respuesta se lee con useActionState y useFormStatus.
   - Vue: v-model, @submit.prevent y un fetch propio hacia una ruta de API.
   - Nuxt: igual que Vue, con una ruta en server/api y $fetch. No hay un concepto de action ligado a
     la página.
   - SvelteKit: un <form method="POST"> estándar y una action en +page.server.ts. Funciona sin
     JavaScript de serie y no hace falta escribir el fetch.

2. Validación y errores
   - React y Vue: se resuelve a mano o con librerías (react-hook-form, vee-validate, Zod).
   - Next.js: la action devuelve un objeto de estado que se lee en el cliente.
   - SvelteKit: fail(400, datos) responde con el error y lo que escribió el usuario, y llega a la
     página como la prop form, tipada a partir de lo que devuelve la action.

3. Mejora progresiva
   - React y Vue: la experiencia depende de que el JavaScript haya cargado.
   - SvelteKit: use:enhance convierte el envío normal en un fetch sin recargar la página, con
     callbacks para el estado «enviando» o para cancelar. update() deja los datos al día solo.

4. Varias acciones en un mismo formulario
   - React y Vue: varios handlers o una condición dentro de uno.
   - SvelteKit: actions con nombre (?/add, ?/remove) y formaction en el botón. Una page.server.ts
     contiene todas las de la página.

5. Refrescar los datos tras enviar
   - React y Vue: volver a pedir los datos, o invalidar la caché de la librería (TanStack Query).
   - Next.js: revalidatePath o revalidateTag dentro de la action.
   - SvelteKit: tras una action con éxito, load se vuelve a ejecutar solo; no hay que invalidar nada.

Conclusión: en React y Vue el envío de formularios es cableado propio (estado, fetch, errores,
recarga de datos). Next.js lo resuelve con Server Actions. SvelteKit parte del <form> del navegador
y añade, con use:enhance, la experiencia de una app sin renunciar a que funcione sin JavaScript.

-->
