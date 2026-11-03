# Svelte y SvelteKit · innusual

Presentación técnica de **Svelte 5** y **SvelteKit 3** para innusual. Cada diapositiva tiene una página de ejemplo funcional, numerada y navegable desde una home con la identidad de la empresa. Al final de cada página hay un resumen en texto que compara Svelte y SvelteKit con React, Next.js, Vue y Nuxt.

Desarrollado por Sergio Sacristán Santero.

## Diapositivas

### Svelte

| #   | Ruta                                                                         | Qué enseña                                                                                         |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 01  | [`/01-reactividad-mediante-runes`](src/routes/01-reactividad-mediante-runes) | `$state`, `$derived`, `$effect`, estado compartido en `.svelte.ts` y `createContext`               |
| 02  | [`/02-binding`](src/routes/02-binding)                                       | `bind:value`, `bind:group`, `bind:this`, `bind:clientWidth`, `$bindable` y function bindings       |
| 03  | [`/03-transiciones`](src/routes/03-transiciones)                             | `transition:`, `in:`/`out:`, `crossfade`, `animate:flip`, transiciones propias, `Tween` y `Spring` |

### SvelteKit

| #   | Ruta                                                                               | Qué enseña                                                                     |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 04  | [`/04-enrutamiento-y-carga-de-datos`](src/routes/04-enrutamiento-y-carga-de-datos) | Rutas por carpetas, layouts, `load`, matchers, streaming y errores             |
| 05  | [`/05-formularios-y-form-actions`](src/routes/05-formularios-y-form-actions)       | Form actions, `fail()`, `use:enhance` y acciones con nombre                    |
| 06  | [`/06-endpoints-api-con-server-js`](src/routes/06-endpoints-api-con-server-js)     | Endpoints `+server.ts`, un handler por verbo HTTP, validación y params tipados |
| 07  | [`/07-page-navigating-y-updated`](src/routes/07-page-navigating-y-updated)         | `page`, `navigating` y `updated` de `$app/state`                               |
| 08  | [`/08-errors-y-navigates`](src/routes/08-errors-y-navigates)                       | `error()`, `redirect()`, `goto` y el ciclo de navegación                       |
| 09  | [`/09-hooks`](src/routes/09-hooks)                                                 | `handle`, `handleFetch`, `handleError` y `reroute`                             |
| 10  | [`/10-page-options`](src/routes/10-page-options)                                   | `prerender`, `ssr`, `csr` y `trailingSlash`, ruta a ruta                       |

Las URL que no existen redirigen a la home. Las excepciones son las diapositivas 04, 07 y 08, que enseñan errores 404, y las rutas `/api/`, que siguen respondiendo 404.

## Stack

- [Svelte 5](https://svelte.dev) con runes y [SvelteKit 3](https://svelte.dev/docs/kit)
- TypeScript y [Tailwind CSS 4](https://tailwindcss.com)
- [Vitest](https://vitest.dev) (tests de servidor y de componentes en Chromium) con cobertura de V8
- [Bun](https://bun.sh) como gestor de paquetes
- Despliegue en [Vercel](https://vercel.com) con `@sveltejs/adapter-vercel`

## Puesta en marcha

Hace falta [Bun](https://bun.sh) y Node 22 o superior.

```sh
bun install
bun run dev                 # servidor de desarrollo
bun run dev -- --open       # y abre el navegador
```

### Scripts

| Comando                 | Qué hace                                         |
| ----------------------- | ------------------------------------------------ |
| `bun run dev`           | Servidor de desarrollo                           |
| `bun run build`         | Build de producción (salida en `.vercel/output`) |
| `bun run preview`       | Sirve el build de producción                     |
| `bun run check`         | Comprobación de tipos con `svelte-check`         |
| `bun run lint`          | Prettier y ESLint                                |
| `bun run format`        | Da formato a todo el proyecto con Prettier       |
| `bun run test`          | Tests una sola vez                               |
| `bun run test:unit`     | Tests en modo watch                              |
| `bun run test:coverage` | Tests con informe de cobertura (`coverage/`)     |

Los tests de componentes usan Chromium. La primera vez hay que instalarlo:

```sh
bunx playwright install chromium
```

## Estructura

```text
src/
├── routes/
│   ├── +page.svelte              # home con las tarjetas (una entrada por diapositiva)
│   ├── +layout.svelte            # barra con "← Home" y el logotipo
│   ├── +error.svelte             # página 404 y errores generales
│   ├── [...rest]/                # ruta comodín: redirige a la home lo que no existe
│   └── NN-titulo-de-la-diapositiva/
├── lib/
│   ├── components/               # SlideShell, DemoCard, CardCarousel y componentes de las demos
│   ├── state/                    # estado compartido con runes (.svelte.ts)
│   └── server/                   # lógica de servidor: datos, formularios y handles de hooks
├── hooks.server.ts               # handle, handleFetch y handleError
├── hooks.ts                      # reroute
└── params.ts                     # matchers de parámetros de ruta
static/brand/                     # banner y logotipo de innusual
```

### Añadir una diapositiva

1. Crear la carpeta `src/routes/NN-titulo-de-la-diapositiva/` con su `+page.svelte`, usando `SlideShell` y `DemoCard`.
2. Terminar la página con un comentario HTML que resuma la comparación con React, Next, Vue y Nuxt.
3. Añadir su tarjeta al array `sections` de [`src/routes/+page.svelte`](src/routes/+page.svelte).
4. Si la diapositiva enseña un 404, añadir su carpeta a `KEEP_404` en [`src/routes/[...rest]/+page.server.ts`](src/routes/[...rest]/+page.server.ts).
5. Si inserta una diapositiva en medio, renombrar las carpetas posteriores y actualizar su `number`, su `base` en `paths.ts` y las rutas que las mencionen.

Las rutas que cuentan con tests (`+server.ts`, hooks y estado) llevan su `*.spec.ts` al lado.

## Calidad y flujo de trabajo

La rama `main` está protegida: todo cambio llega mediante una pull request.

Cada PR ejecuta la integración continua de [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- **Tipos**: `bun run check`.
- **Tests y cobertura**: `bun run test:coverage`. Falla si algún test falla o si la cobertura baja de los umbrales de [`vite.config.ts`](vite.config.ts) (90 % en sentencias, líneas y funciones, 80 % en ramas).

La cobertura mide la lógica (estado, datos, endpoints, hooks y matchers). Las páginas y los componentes son interfaz de ejemplo y se comprueban con `svelte-check`.

Vercel despliega mediante su integración con GitHub: cada PR genera una vista previa y `main` se publica en producción.
