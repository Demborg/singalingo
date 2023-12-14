const A4 = 440;
const A4_INDEX = 49; // A4 is the 49th key on the piano
const SEMITONES_IN_OCTAVE = 12;
const NOTE_NAMES = [ 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'];

export function frequencyToNoteName(frequency: number): string {
	let n = SEMITONES_IN_OCTAVE * Math.log2(frequency / A4) + A4_INDEX;
	n = Math.round(n); // Round to nearest semitone


	// Calculate the note index and octave
	const noteIndex = (n - 1) % SEMITONES_IN_OCTAVE;
	const octave = Math.floor((n + 8) / SEMITONES_IN_OCTAVE);

	return NOTE_NAMES[noteIndex] + "/" + octave;
}

export function noteNameToFrequency(noteName: string): number {
	const parts = noteName.split('/');
	const note = parts[0].toLowerCase();
	const noteIndex = NOTE_NAMES.indexOf(note[0]);
	const octave = parseInt(parts[1]);

	const n = 4 * SEMITONES_IN_OCTAVE + noteIndex + 1;
	return A4 * Math.pow(2, (n - A4_INDEX) / SEMITONES_IN_OCTAVE);
}