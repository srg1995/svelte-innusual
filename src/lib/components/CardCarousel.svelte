<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		items,
		label,
		header,
		card
	}: {
		items: T[];
		label: string;
		// Cabecera opcional: se pinta a la izquierda y los controles a la derecha, en la misma fila
		header?: Snippet;
		card: Snippet<[T]>;
	} = $props();

	let track = $state<HTMLUListElement | null>(null);
	let canPrev = $state(false);
	let canNext = $state(false);
	let active = $state(0);

	// Respeta la preferencia del sistema de reducir animaciones
	const behavior = (): ScrollBehavior =>
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

	// Posición de la tarjeta i dentro de la pista (offsetLeft es relativo al contenedor posicionado)
	const slideLeft = (i: number) => (track?.children[i] as HTMLElement | undefined)?.offsetLeft ?? 0;

	function update() {
		if (!track) return;
		const max = track.scrollWidth - track.clientWidth;
		canPrev = track.scrollLeft > 8;
		canNext = track.scrollLeft < max - 8;

		// Tarjeta más cercana al borde izquierdo; la última se marca al llegar al final
		const first = slideLeft(0);
		let closest = 0;
		for (let i = 0; i < items.length; i++) {
			if (
				Math.abs(slideLeft(i) - first - track.scrollLeft) <
				Math.abs(slideLeft(closest) - first - track.scrollLeft)
			) {
				closest = i;
			}
		}
		active = max > 0 && track.scrollLeft >= max - 8 ? items.length - 1 : closest;
	}

	function scrollPage(direction: 1 | -1) {
		track?.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: behavior() });
	}

	function goTo(i: number) {
		track?.scrollTo({ left: slideLeft(i) - slideLeft(0), behavior: behavior() });
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			scrollPage(1);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			scrollPage(-1);
		}
	}

	// Recalcula al montar y cuando cambia el tamaño de la pista (cambia cuántas tarjetas caben)
	$effect(() => {
		if (!track) return;
		update();
		const observer = new ResizeObserver(update);
		observer.observe(track);
		return () => observer.disconnect();
	});

	const arrow =
		'grid h-8 w-8 place-items-center rounded-full border border-ink-200 bg-white text-base text-innusual-ink shadow-sm transition hover:border-innusual-purple hover:text-innusual-purple disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink-200 disabled:hover:text-innusual-ink';
</script>

<div role="region" aria-roledescription="carrusel" aria-label={label} class="relative">
	<!-- Cabecera a la izquierda y controles a la derecha, en una sola fila -->
	<div class="mb-3 flex min-h-8 items-center justify-between gap-4 border-b border-ink-200 pb-2">
		<div class="flex flex-wrap items-baseline gap-x-3">{@render header?.()}</div>

		{#if canPrev || canNext}
			<div class="flex shrink-0 items-center gap-4">
				<div class="hidden gap-1.5 sm:flex">
					{#each Array.from({ length: items.length }, (_, i) => i) as i (i)}
						<button
							type="button"
							aria-label="Ir a la diapositiva {i + 1}"
							aria-current={i === active}
							onclick={() => goTo(i)}
							class="h-2 rounded-full transition-all {i === active
								? 'w-6 bg-innusual-purple'
								: 'w-2 bg-ink-200 hover:bg-ink-400'}"
						></button>
					{/each}
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						aria-label="Anterior"
						disabled={!canPrev}
						onclick={() => scrollPage(-1)}
						class={arrow}
					>
						←
					</button>
					<button
						type="button"
						aria-label="Siguiente"
						disabled={!canNext}
						onclick={() => scrollPage(1)}
						class={arrow}
					>
						→
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- La pista se puede desplazar con rueda, gesto táctil, flechas del teclado o los botones -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<ul
		bind:this={track}
		onscroll={update}
		onkeydown={onKeydown}
		tabindex="0"
		aria-label="{label}: usa las flechas izquierda y derecha para desplazarte"
		class="relative -mx-1 -my-2 flex snap-x snap-mandatory scroll-px-1 [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-1 py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-innusual-purple motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
	>
		{#each items as item, i (i)}
			<li
				aria-roledescription="diapositiva"
				aria-label="{i + 1} de {items.length}"
				class="min-w-0 shrink-0 basis-full snap-start sm:basis-[calc(50%-0.5rem)] lg:basis-[calc((100%-2rem)/3)]"
			>
				{@render card(item)}
			</li>
		{/each}
	</ul>
</div>
