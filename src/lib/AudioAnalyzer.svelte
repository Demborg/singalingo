<script lang="ts">
	import { onMount } from 'svelte';
	import { frequencyToNoteName, noteNameToFrequency } from './toneTools';
	import Notation from './Notation.svelte';
	import AudioVisualizer from './AudioVisualizer.svelte';

	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let dataArray: Uint8Array;
	let dominantFrequency: number = 0;
	const notes = ['c/4', 'c/5', 'a/4', 'g/4'];
	let current_note_index = 2;

	onMount(() => {
		// Deferred initialization to ensure user gesture
	});

	async function initAudio(): Promise<void> {
		try {
			const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			});
			audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(stream);
			analyser = audioContext.createAnalyser();
			source.connect(analyser);
			analyser.fftSize = 2048;
			const bufferLength = analyser.frequencyBinCount;
			dataArray = new Uint8Array(bufferLength);
			draw();
		} catch (err) {
			console.error('Error accessing audio stream:', err);
		}
	}

	function draw(): void {
		requestAnimationFrame(draw);
		analyser.getByteFrequencyData(dataArray);
		dataArray = dataArray;

		const dominantFrequencyIndex = dataArray.indexOf(Math.max(...dataArray));
		dominantFrequency = (dominantFrequencyIndex * audioContext.sampleRate) / analyser.fftSize;
	}
</script>

<button on:click={initAudio}>Start Microphone Input</button>
<AudioVisualizer {dataArray} />
<p>Dominant frequency {dominantFrequency.toFixed(1)} is note {frequencyToNoteName(dominantFrequency)}</p>
<Notation {notes} currentNoteIndex={current_note_index} />
