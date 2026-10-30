import { describe, expect, it } from 'vitest';
import { Settings } from './settings.svelte.js';

describe('Settings', () => {
	it('usa euros por defecto', () => {
		const settings = new Settings();
		expect(settings.currency).toBe('EUR');
		expect(settings.symbol).toBe('€');
		expect(settings.format(10)).toBe('10.00 €');
	});

	it('convierte a dólares al cambiar la moneda', () => {
		const settings = new Settings();
		settings.currency = 'USD';
		expect(settings.symbol).toBe('$');
		expect(settings.rate).toBe(1.08);
		expect(settings.format(10)).toBe('10.80 $');
	});

	it('cada instancia es independiente', () => {
		const a = new Settings();
		const b = new Settings();
		a.currency = 'USD';
		expect(b.currency).toBe('EUR');
	});
});
