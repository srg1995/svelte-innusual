<script lang="ts">
	import DemoCard from '#lib/components/DemoCard.svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { base } from './paths';

	let { data }: PageProps = $props();

	let name = $state('');
	let result = $state('');

	async function login(e: SubmitEvent) {
		e.preventDefault();
		await fetch(`${base}/api/session`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name })
		});
		name = '';
		await invalidateAll(); // vuelve a ejecutar los load: handle leerá la cookie nueva
	}

	async function logout() {
		await fetch(`${base}/api/session`, { method: 'DELETE' });
		await invalidateAll();
	}

	// Las cabeceras x-response-time y x-request-id las añade el handle `timing`
	async function callEcho() {
		const res = await fetch(`${base}/api/echo`);
		result = `x-response-time: ${res.headers.get('x-response-time')} · x-request-id: ${res.headers.get('x-request-id')}`;
	}
</script>

{#if page.url.searchParams.get('aviso') === 'login'}
	<p class="mb-5 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
		Te redirigió el hook <code>handle</code>: la zona privada necesita sesión.
	</p>
{/if}

<div class="grid gap-5 lg:grid-cols-2">
	<DemoCard
		title="handle: sesión"
		description="Lee la cookie, la deja en locals y protege la zona privada."
	>
		{#if data.user}
			<p class="text-sm text-ink-500">
				Hola, {data.user.name}.
				<button onclick={logout} class="underline">Cerrar sesión</button>
			</p>
		{:else}
			<form onsubmit={login} class="flex gap-2">
				<input
					bind:value={name}
					placeholder="Tu nombre"
					class="w-full rounded-lg border border-ink-200 px-3 py-2"
				/>
				<button class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white"
					>Entrar</button
				>
			</form>
		{/if}
	</DemoCard>

	<DemoCard
		title="handle: cabeceras"
		description="x-response-time y x-request-id los añade un handle."
	>
		<button onclick={callEcho} class="rounded-lg border border-ink-200 px-3 py-1 text-sm">
			Llamar a /api/echo
		</button>
		{#if result}<p class="text-xs text-ink-500">{result}</p>{/if}
	</DemoCard>

	<DemoCard title="handleFetch" description="El fetch de load lleva una cabecera extra.">
		<p class="text-xs text-ink-500">
			Petición de la página: <code>{data.requestId}</code> · el endpoint recibió
			<code>x-origin-request-id: {data.echo.originRequestId}</code>
		</p>
	</DemoCard>

	<DemoCard
		title="reroute"
		description="Una URL puede renderizar otra ruta sin cambiar en la barra."
	>
		<p class="text-sm text-ink-500">
			El enlace «URL antigua» muestra la página <code>nuevo</code> sin cambiar la URL.
		</p>
	</DemoCard>
</div>

<!--

Resumen: hooks de SvelteKit frente a middleware de otros frameworks

Todos los hooks de servidor están en src/hooks.server.ts, y reroute en src/hooks.ts. Son globales:
afectan a todas las rutas de la aplicación, no solo a esta diapositiva.

1. handle: el middleware de cada petición
   - Se ejecuta antes de resolver la ruta y también tiene acceso a la respuesta. Aquí asigna un id a
     la petición, mide el tiempo, añade cabeceras (x-response-time, x-request-id), lee la cookie de
     sesión y protege la zona privada con una redirección.
   - Lo que guarda en event.locals (tipado en App.Locals) llega a todos los load y +server.ts.
   - sequence() encadena varios handle en orden, como una cadena de middleware.
   - Express: app.use encadena middleware, pero hay que montar y tipar todo a mano. Next.js: un único
     middleware.ts que se ejecuta en el edge, con APIs limitadas y sin acceso directo a la capa de
     datos. Nuxt: middleware de servidor en server/middleware y de ruta en middleware/.

2. handleFetch
   - Intercepta el event.fetch de load y +server.ts. Sirve para añadir cabeceras a peticiones
     internas, reescribir URLs hacia una API interna o reenviar credenciales. En Next.js y Nuxt no
     hay un punto único: se envuelve fetch a mano.

3. handleError
   - Gestiona los errores del servidor (ver la diapositiva 07).

4. reroute
   - Hook universal (servidor y navegador) que decide qué ruta renderiza una URL sin cambiar la URL
     que ve el usuario. Equivale a las reescrituras (rewrites) de Next.js o a routeRules de Nuxt,
     pero con código en lugar de configuración.

5. Otros hooks
   - init (inicialización una vez al arrancar) y transport (enviar tipos propios entre servidor y
     cliente). En el cliente, hooks.client.ts permite handleError e init. resolve acepta opciones
     como transformPageChunk, para modificar el HTML final.

Conclusión: los hooks son el punto único y tipado donde se resuelve todo lo transversal (sesión,
cabeceras, trazas, errores, reescrituras), sin servidor aparte ni configuración dispersa.

-->
