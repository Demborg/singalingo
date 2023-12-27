<script lang="ts">
	import { afterUpdate } from 'svelte';
	export let dataArray: Float32Array;
	export let indexToFrequency: (index: number) => number;
	export let minFrequency: number;
	export let maxFrequency: number;
	export let detectedFrequency: number | null = null;
	export let minIntensity: number;
	export let maxIntensity: number;

	const frequencyToX = (f: number, width: number): number => {
		return (Math.log2(f / minFrequency) / Math.log2(maxFrequency / minFrequency)) * width;
	};

	afterUpdate(() => {
		if (!dataArray) return;
		const canvas: HTMLCanvasElement | null = document.getElementById(
			'visualizer'
		) as HTMLCanvasElement;
		if (!canvas) return;
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) return;

		canvasContext.fillStyle = 'rgb(200, 200, 200)';
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);

		canvasContext.lineWidth = 2;
		canvasContext.strokeStyle = 'rgb(0, 0, 0)';
		canvasContext.beginPath();
		let detectedY: number = 0;
		let closestF: number = 0;

		for (let i = 0; i < dataArray.length; i++) {
			const frequency = indexToFrequency(i);
			const y: number =
				(1 - (dataArray[i] - minIntensity) / (maxIntensity - minIntensity)) * canvas.height;
			if (
				detectedFrequency &&
				Math.abs(detectedFrequency - closestF) > Math.abs(detectedFrequency - frequency)
			) {
				detectedY = y;
				closestF = frequency;
			}
			const x = frequencyToX(frequency, canvas.width);

			if (i === 0) {
				canvasContext.moveTo(x, y);
			} else {
				canvasContext.lineTo(x, y);
			}
		}

		canvasContext.lineTo(canvas.width, canvas.height / 2);
		canvasContext.stroke();

		canvasContext.beginPath();
		if (detectedFrequency) {
			canvasContext.arc(
				frequencyToX(detectedFrequency, canvas.width),
				detectedY,
				5,
				0,
				2 * Math.PI
			);
		}
		canvasContext.fillStyle = 'rgb(0, 0, 0)';
		canvasContext.fill();
	});
</script>

<canvas id="visualizer" width="640" height="100" class="visualizer"></canvas>

<style>
	.visualizer {
		width: 100%;
		max-width: 500px;
	}
</style>
