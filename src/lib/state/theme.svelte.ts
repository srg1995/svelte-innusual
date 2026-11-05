import { createContext } from 'svelte';

export type ThemeName = 'claro' | 'oscuro' | 'innusual';

// Las clases completas viven aquí (no se construyen por trozos) para que Tailwind las detecte
export const themeClasses: Record<ThemeName, string> = {
	claro: 'border-ink-200 bg-white text-innusual-ink',
	oscuro: 'border-ink-500 bg-innusual-ink text-white',
	innusual:
		'border-transparent bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose text-white'
};

export class Theme {
	name = $state<ThemeName>('claro');
	classes = $derived(themeClasses[this.name]);

	constructor(name: ThemeName = 'claro') {
		this.name = name;
	}
}

// Los contextos se anidan: getTheme() devuelve el Theme del ancestro MÁS CERCANO
export const [getTheme, setTheme] = createContext<Theme>();
