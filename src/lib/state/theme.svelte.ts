import { createContext } from 'svelte';

export type ThemeName = 'claro' | 'oscuro' | 'innusual';

// Las clases completas viven aquí (no se construyen por trozos) para que Tailwind las detecte
export const themeClasses: Record<ThemeName, string> = {
	claro: 'border-[#e0e0e8] bg-[#ffffff] text-[#1f1f1d]',
	oscuro: 'border-[#676778] bg-[#1f1f1d] text-[#ffffff]',
	innusual:
		'border-transparent bg-gradient-to-br from-innusual-teal via-innusual-purple to-innusual-rose text-white'
};

export class Theme {
	name = $state<ThemeName>('claro');
	classes = $derived(themeClasses[this.name]);

	constructor(name: ThemeName = 'claro') {
		this.name = name;
	}

	// Alterna entre claro y oscuro (el tema «innusual» solo se elige desde un selector)
	toggle() {
		this.name = this.name === 'oscuro' ? 'claro' : 'oscuro';
	}
}

// Los contextos se anidan: getTheme() devuelve el Theme del ancestro MÁS CERCANO
export const [getTheme, setTheme] = createContext<Theme>();
