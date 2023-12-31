import { describe, it, expect } from 'vitest';

import { frequencyToNoteName, noteNameToFrequency } from '$lib/toneTools';

describe('Frequency to tone test', () => {
	it('tests a/4', () => {
		expect(frequencyToNoteName(440)).toBe('a/4');
	});
	it('tests c/5', () => {
		expect(frequencyToNoteName(523.25)).toBe('c/5');
	});
	it('tests e/5', () => {
		expect(frequencyToNoteName(659.25)).toBe('e/5');
	});
	it('tests f/6', () => {
		expect(frequencyToNoteName(1396.91)).toBe('f/6');
	});
	it('tests e/1', () => {
		expect(frequencyToNoteName(41.2)).toBe('e/1');
	});
});

describe('Tone to frequency test', () => {
	it('tests c/0', () => {
		expect(noteNameToFrequency('c/0')).toBeCloseTo(16.35, 1);
	});
	it('tests a/4', () => {
		expect(noteNameToFrequency('a/4')).toBeCloseTo(440, 1);
	});
	it('tests c/5', () => {
		expect(noteNameToFrequency('c/5')).toBeCloseTo(523.25, 1);
	});
	it('tests e/5', () => {
		expect(noteNameToFrequency('e/5')).toBeCloseTo(659.25, 1);
	});
	it('tests g#/4', () => {
		expect(noteNameToFrequency('g#/4')).toBeCloseTo(415.3, 1);
	});
});
