export function frequencyToNoteName(frequency: number): string {
    const A4 = 440;
    const A4_INDEX = 49; // A4 is the 49th key on the piano
    const SEMITONES_IN_OCTAVE = 12;

    let n = SEMITONES_IN_OCTAVE * Math.log2(frequency / A4);
    n = Math.round(n); // Round to nearest semitone

    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    // Calculate the note index and octave
    const noteIndex = (A4_INDEX + n) % SEMITONES_IN_OCTAVE;
    const octave = Math.floor((A4_INDEX + n) / SEMITONES_IN_OCTAVE);

    return noteNames[noteIndex] + octave;
}