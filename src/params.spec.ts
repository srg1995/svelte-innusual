import { describe, expect, it } from 'vitest';
import { params } from './params';

// defineParams normaliza cada matcher a un Standard Schema: se valida con ['~standard'].validate
const validate = (value: string) => params.integer['~standard'].validate(value);

describe('matcher integer', () => {
	it('acepta enteros y los convierte a number', async () => {
		expect(await validate('42')).toEqual({ value: 42 });
		expect(await validate('0')).toEqual({ value: 0 });
	});

	it.each(['abc', '4.2', '-1', '', '12a'])('rechaza %j', async (input) => {
		const result = await validate(input);
		expect(result).toHaveProperty('issues');
	});
});
