import { describe, expect, it } from 'vitest';
import { asEvent } from './test/helpers';
import { reroute } from './hooks';

const call = (path: string) =>
	reroute(asEvent<Parameters<typeof reroute>[0]>({ url: new URL('http://localhost' + path) }));

describe('reroute', () => {
	it('reescribe la URL antigua hacia la nueva', () => {
		expect(call('/09-hooks/antiguo')).toBe('/09-hooks/nuevo');
	});

	it('no toca el resto de rutas', () => {
		expect(call('/09-hooks')).toBeUndefined();
		expect(call('/')).toBeUndefined();
	});
});
