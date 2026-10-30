<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageProps } from './$types';
	import { base } from './paths';

	type Exchange = { request: string; status: number; body: string };

	let { data }: PageProps = $props();

	let text = $state('');
	let last = $state<Exchange | null>(null);

	// Llamada genérica al API: guarda la respuesta cruda para mostrarla y recarga el listado
	async function call(method: string, path: string, body?: unknown) {
		const res = await fetch(`${base}/api${path}`, {
			method,
			headers: body === undefined ? undefined : { 'content-type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body)
		});
		// Si ninguna ruta coincide (matcher), Kit responde con la página de error HTML: no la volcamos
		const isHtml = res.headers.get('content-type')?.includes('text/html');
		const output = isHtml ? '(HTML: ninguna ruta coincide)' : (await res.text()) || '(sin cuerpo)';
		last = { request: `${method} /api${path}`, status: res.status, body: output };
		if (res.ok) await invalidate('app:todos');
	}

	async function add(e: SubmitEvent) {
		e.preventDefault();
		await call('POST', '/todos', { text });
		text = '';
	}
</script>

<main class="grid min-h-screen place-items-start justify-center bg-ink-50 p-8">
	<div class="w-full max-w-xl space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-md">
		<header>
			<h1 class="text-2xl font-semibold text-ink-900">05 · Endpoints API con +server.js</h1>
			<p class="text-sm text-ink-500">
				Una función por verbo HTTP en <code>api/todos/+server.ts</code>
			</p>
		</header>

		<form onsubmit={add} class="flex gap-2">
			<input
				bind:value={text}
				placeholder="Nueva tarea (vacía para provocar un 400)"
				class="w-full rounded-lg border border-ink-200 px-3 py-2"
			/>
			<button class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">POST</button>
		</form>

		<ul class="space-y-2">
			{#each data.todos as todo (todo.id)}
				<li class="flex items-center gap-3 rounded-lg border border-ink-200 px-3 py-2">
					<input
						type="checkbox"
						checked={todo.done}
						onchange={(e) => call('PATCH', `/todos/${todo.id}`, { done: e.currentTarget.checked })}
					/>
					<span class="flex-1 text-ink-900 {todo.done ? 'line-through opacity-60' : ''}">
						{todo.text}
					</span>
					<button onclick={() => call('DELETE', `/todos/${todo.id}`)} class="text-sm text-ink-500">
						DELETE
					</button>
				</li>
			{:else}
				<li class="text-sm text-ink-500">No hay tareas.</li>
			{/each}
		</ul>

		<section class="space-y-2">
			<h2 class="text-sm font-medium text-ink-900">Probar casos concretos</h2>
			<div class="flex flex-wrap gap-2 text-sm">
				<button onclick={() => call('GET', '/todos?done=true')} class="rounded-lg border border-ink-200 px-3 py-1">
					GET ?done=true
				</button>
				<button onclick={() => call('GET', '/todos/2')} class="rounded-lg border border-ink-200 px-3 py-1">
					GET /todos/2
				</button>
				<button onclick={() => call('GET', '/todos/999')} class="rounded-lg border border-ink-200 px-3 py-1">
					GET /todos/999 (404)
				</button>
				<button onclick={() => call('GET', '/todos/abc')} class="rounded-lg border border-ink-200 px-3 py-1">
					GET /todos/abc (matcher)
				</button>
			</div>

			{#if last}
				<pre class="overflow-auto rounded-lg bg-ink-100 p-3 text-xs text-ink-900"><b>{last.request}</b> → {last.status}
{last.body}</pre>
			{/if}
		</section>
	</div>
</main>

<!--

Resumen: endpoints de SvelteKit frente a Next.js, Nuxt y Express

Archivos de esta sección: api/todos/+server.ts, api/todos/[id=integer]/+server.ts y +page.ts.

1. Cómo se define un endpoint
   - Next.js (App Router): route.ts con funciones exportadas GET, POST, etc.; es casi idéntico.
   - Nuxt: archivos en server/api/ (todos.get.ts, todos.post.ts) con defineEventHandler.
   - Express: se registran en código con app.get('/todos', ...), app.post(...), y hay que montar el
     servidor aparte.
   - SvelteKit: un archivo +server.ts por ruta, con una función exportada por verbo HTTP (GET, POST,
     PATCH, DELETE...). No hay servidor que configurar: el endpoint vive junto a las páginas y usa
     el mismo enrutamiento por carpetas, parámetros y matchers.

2. Petición y respuesta
   - Los handlers reciben un RequestEvent con request, url, params, cookies, locals y fetch, y
     devuelven una Response estándar de la web. json() es solo un atajo para crearla.
   - Express usa sus propios objetos req y res; Nuxt, un event con helpers (readBody, getQuery).
     En SvelteKit se usan las APIs del estándar (request.json(), url.searchParams).

3. Validación y errores
   - El body de un POST llega sin validar: se lee como unknown y se comprueba antes de usarlo.
   - error(400, mensaje) corta la ejecución y responde en JSON (con Accept: html, en página de
     error). 204 se devuelve con new Response(null, { status: 204 }).
   - HEAD y OPTIONS se generan solos, y un verbo no definido responde 405.

4. Parámetros tipados
   - Con un matcher, params.id llega ya como number y las URL inválidas dan 404 antes de ejecutar el
     handler. En Express o Next.js la conversión y la validación se hacen a mano en cada handler.

5. Consumirlos desde las páginas
   - El fetch que reciben load y los handlers llama al endpoint internamente en el servidor, sin
     salir a la red, y en el navegador reutiliza la respuesta ya incluida en el HTML.
   - Si solo la propia aplicación consume los datos, suele bastar un load con +page.server.ts; los
     endpoints +server.ts tienen sentido para clientes externos (móvil, terceros), webhooks,
     descargas o respuestas que no son HTML.

Conclusión: SvelteKit y Next.js son muy parecidos aquí; la diferencia es que en SvelteKit endpoints,
páginas y matchers comparten el mismo modelo de rutas por carpetas, y todo se apoya en los
objetos estándar Request y Response.

-->
