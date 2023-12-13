import { describe, it, expect } from 'vitest';

import { frequencyToNoteName } from '$lib/toneTools';

describe('Frequency to tone test', () => {
	it('tests C#4', () => {
		expect(frequencyToNoteName(440)).toBe("C#4");
	});
});
