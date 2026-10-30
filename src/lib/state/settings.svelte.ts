import { createContext } from 'svelte';

export type Currency = 'EUR' | 'USD';

export class Settings {
	currency = $state<Currency>('EUR');
	symbol = $derived(this.currency === 'EUR' ? '€' : '$');
	rate = $derived(this.currency === 'EUR' ? 1 : 1.08);

	format(amount: number) {
		return `${(amount * this.rate).toFixed(2)} ${this.symbol}`;
	}
}

// createContext devuelve [get, set] ya tipados: no hay claves Symbol ni casts.
// Cada subárbol que llame a setSettings tiene su propia instancia aislada.
export const [getSettings, setSettings] = createContext<Settings>();
