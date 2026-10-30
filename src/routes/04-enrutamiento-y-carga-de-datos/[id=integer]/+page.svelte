<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import { base } from '../paths';

	let { data }: PageProps = $props();
</script>

<a href={base} class="text-sm text-brand-600 underline">← Volver</a>

<article class="space-y-1">
	<h2 class="text-xl font-semibold text-ink-900">{data.product.name}</h2>
	<p class="text-sm text-ink-500">
		{data.categoryLabel} · {data.product.price} € · <code>params.id = {page.params.id}</code>
	</p>
	<p class="text-ink-900">{data.product.description}</p>
</article>

<section>
	<h3 class="mb-1 text-sm font-medium text-ink-900">Reseñas (streaming)</h3>
	{#await data.reviews}
		<p class="text-sm text-ink-500">Cargando reseñas…</p>
	{:then reviews}
		<ul class="space-y-1 text-sm text-ink-500">
			{#each reviews as review (review.author)}
				<li>{'★'.repeat(review.rating)} {review.author}: {review.text}</li>
			{:else}
				<li>Sin reseñas todavía.</li>
			{/each}
		</ul>
	{:catch}
		<p class="text-sm text-brand-600">No se pudieron cargar las reseñas.</p>
	{/await}
</section>
