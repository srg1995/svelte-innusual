import { describe, expect, it } from 'vitest';
import { Theme, themeClasses } from './theme.svelte.js';

describe('Theme', () => {
	it('empieza en claro salvo que se indique otro tema', () => {
		expect(new Theme().name).toBe('claro');
		expect(new Theme('oscuro').name).toBe('oscuro');
	});

	it('deriva las clases del tema actual', () => {
		const theme = new Theme();
		expect(theme.classes).toBe(themeClasses.claro);
		theme.name = 'innusual';
		expect(theme.classes).toBe(themeClasses.innusual);
	});

	it('alterna entre claro y oscuro', () => {
		const theme = new Theme();
		theme.toggle();
		expect(theme.name).toBe('oscuro');
		theme.toggle();
		expect(theme.name).toBe('claro');
	});

	it('desde el tema innusual pasa a oscuro', () => {
		const theme = new Theme('innusual');
		theme.toggle();
		expect(theme.name).toBe('oscuro');
	});

	it('cada instancia es independiente', () => {
		const a = new Theme('oscuro');
		const b = new Theme();
		a.name = 'innusual';
		expect(b.name).toBe('claro');
	});
});
