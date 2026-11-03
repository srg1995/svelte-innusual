<p class="text-sm text-ink-500">
	Navega por los enlaces y observa cómo cambian los valores de abajo sin recargar la página.
</p>

<!--

Resumen: page, navigating y updated frente a otros frameworks

Los tres vienen de '$app/state' y son objetos reactivos: se leen directamente, sin suscribirse. El
panel de inspección está en +layout.svelte, para que se vea cómo cambian al navegar entre rutas.

1. page
   - Contiene la URL actual (url.pathname, url.searchParams, url.hash), los parámetros de la ruta
     (params), el id de la ruta (route.id), el status, el error, los datos de las funciones load
     (data), el resultado de un formulario (form) y el estado de la navegación superficial (state).
   - Next.js reparte lo mismo entre varios hooks: usePathname, useSearchParams y useParams. Nuxt usa
     useRoute. React Router, useLocation y useParams. En SvelteKit todo está en un único objeto.
   - Al ser reactivo, page.params.id o page.url.searchParams.get('color') se actualizan solos al
     cambiar de ruta o de query string, sin useEffect ni watch.

2. navigating
   - Tiene valor solo mientras dura una navegación: from, to, type (link, goto, popstate, form, leave)
     y complete, una promesa que se resuelve al terminar. En reposo, navigating.to es null.
   - Es lo que se usa para barras de progreso y esqueletos de carga globales. En Next.js hay que
     montar el indicador a mano con loading.tsx o librerías externas; en Nuxt existe
     useLoadingIndicator; en React Router, useNavigation.
   - La página anterior sigue visible hasta que load termina, de ahí la barra de progreso.

3. updated
   - updated.current pasa a true cuando SvelteKit detecta que hay una versión nueva de la aplicación
     desplegada, y updated.check() fuerza la comprobación en el momento.
   - Resuelve el problema clásico de pestañas abiertas con código antiguo tras un despliegue (enlaces
     rotos, errores de chunks). La comprobación se hace en respuestas de datos, al volver a la pestaña
     y por sondeo (kit.version.pollInterval). En otros frameworks se suele resolver con código propio.
   - Solo detecta cambios en una compilación de producción: en desarrollo no hay versiones nuevas.

4. De los stores a las runes
   - Antes de $app/state, esto se hacía con los stores de '$app/stores' ($page, $navigating,
     $updated), que ahora están obsoletos. $app/state es lo mismo con runes: sin prefijo $ y sin
     suscripciones.

Conclusión: en SvelteKit el estado del enrutador se lee como cualquier otra variable reactiva. Lo que
en React se reparte entre hooks (useParams, useSearchParams, useNavigation...) aquí son tres imports.

-->
