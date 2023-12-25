<script lang="ts">
	import { frequencyToNoteName, noteNameToFrequency, median } from './toneTools';
	import Notation from './Notation.svelte';
	import AudioVisualizer from './AudioVisualizer.svelte';
	import Notify from './Notify.svelte';
	import Button from './Button.svelte';

	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let dataArray: Float32Array;
	let dominantFrequency: number | null = null;
	const levels = [
		['c/4', 'd/4', 'e/4', 'f/4'],
		['g/4', 'a/4', 'b/4', 'c/5'],
		['c/5', 'b/4', 'a/4', 'g/4'],
		['f/4', 'e/4', 'd/4', 'c/4'],
		['c/4', 'e/4', 'g/4', 'c/5'],
		['c/5', 'g/4', 'e/4', 'c/4']
	];
	let level = 0;
	let current_note_index = 0;
	let timer_id: NodeJS.Timeout | null = null;
	let message: string | null = null;
	let minIntensity: number = 0;
	let maxIntensity: number = 100;

	const isFrequencyClose = (a: number, b: number) => {
		const max_f = Math.max(a, b);
		const min_f = Math.min(a, b);

		return max_f / min_f < 1.06;
	};

	const indexToFrequency = (index: number) => {
		return (index * audioContext.sampleRate) / analyser.fftSize;
	};

	const restart = (): void => {
		level = 0;
		current_note_index = 0;
	};

	function increment(): void {
		if (current_note_index < levels[level].length - 1) {
			current_note_index += 1;
			return;
		}

		if (level < levels.length - 1) {
			message = 'You have completed the level';
			level += 1;
			current_note_index = 0;
			return;
		}
		message = 'You have completed the game!';
		restart();
	}

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
			analyser.smoothingTimeConstant = 0.8;
			const bufferLength = analyser.frequencyBinCount;
			dataArray = new Float32Array(bufferLength);
			draw();
		} catch (err) {
			console.error('Error accessing audio stream:', err);
		}
	}

	function draw(): void {
		requestAnimationFrame(draw);
		analyser.getFloatFrequencyData(dataArray);
		dataArray = dataArray;
		// dataArray = smoothArray(dataArray);
		// dataArray = smoothArray(dataArray);
		// dataArray = smoothArray(dataArray);
		const medianIntensity = median(dataArray);
		minIntensity = medianIntensity;
		maxIntensity = Math.max(...dataArray);
		console.log(Math.pow(2, minIntensity), Math.pow(2, maxIntensity));
		if (maxIntensity - minIntensity < Math.log2(10000000)) {
			dominantFrequency = null;
			return;
		}
		const dominantFrequencyIndex = dataArray.indexOf(maxIntensity);
		dominantFrequency = indexToFrequency(dominantFrequencyIndex);

		if (
			isFrequencyClose(dominantFrequency, noteNameToFrequency(levels[level][current_note_index]))
		) {
			if (timer_id === null) {
				timer_id = setTimeout(increment, 250);
			}
		} else {
			if (timer_id !== null) {
				clearTimeout(timer_id);
				timer_id = null;
			}
		}
	}
</script>

<p>Enable the microphone and hit the notes to win!</p>
{#if message}
	<Notify
		{message}
		onComplete={() => {
			message = null;
		}}
	/>
{/if}
{#if analyser}
	<AudioVisualizer
		{dataArray}
		{indexToFrequency}
		detectedFrequency={dominantFrequency}
		{minIntensity}
		{maxIntensity}
	/>
{:else}
	<Button onClick={initAudio} text="Enable microphone" />
{/if}

<Notation
	notes={levels[level]}
	currentNoteIndex={current_note_index}
	currentNote={frequencyToNoteName(dominantFrequency)}
/>
