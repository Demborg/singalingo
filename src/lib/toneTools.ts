const A4 = 440;
const A4_INDEX = 49; // A4 is the 49th key on the piano
const SEMITONES_IN_OCTAVE = 12;
const NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

export function frequencyToNoteName(frequency: number): string {
	let n = SEMITONES_IN_OCTAVE * Math.log2(frequency / A4) + A4_INDEX;
	n = Math.round(n) + 8; // Round to nearest semitone

	// Calculate the note index and octave
	const noteIndex = n % SEMITONES_IN_OCTAVE;
	const octave = Math.floor(n / SEMITONES_IN_OCTAVE);
	return NOTE_NAMES[noteIndex] + '/' + octave;
}

export function noteNameToFrequency(noteName: string): number {
	const parts = noteName.split('/');
	const note = parts[0].toLowerCase();
	const noteIndex = NOTE_NAMES.indexOf(note);
	const octave = parseInt(parts[1]);

	const n = octave * SEMITONES_IN_OCTAVE + noteIndex - 8;
	const frequency = A4 * Math.pow(2, (n - A4_INDEX) / SEMITONES_IN_OCTAVE);
	return frequency;
}
