<script lang="ts">
	import { afterUpdate } from 'svelte';
	export let dataArray: Float32Array;
	export let indexToFrequency: (index: number) => number;
	export let minFrequency: number;
	export let maxFrequency: number;
	export let detectedFrequency: number | null = null;
	export let minIntensity: number;
	export let maxIntensity: number;
	const offsetY = 10;

	const frequencyToX = (f: number, width: number): number => {
		return (Math.log2(f / minFrequency) / Math.log2(maxFrequency / minFrequency)) * width;
	};

	function draw(ctx: CanvasRenderingContext2D, height: number, width: number) {
		for (let i = 0; i < dataArray.length; i++) {
			const frequency = indexToFrequency(i);
			const y: number =
				(1 - (dataArray[i] - minIntensity) / (maxIntensity - minIntensity)) *
					(height - 2 * offsetY) +
				offsetY;
			const x = frequencyToX(frequency, width);

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		if (detectedFrequency) {
			const x = frequencyToX(detectedFrequency, width);
			ctx.moveTo(x, 5);
			ctx.arc(x, offsetY, 5, 0, 2 * Math.PI);
		}
	}

	afterUpdate(() => {
		if (!dataArray) return;
		const canvas: HTMLCanvasElement | null = document.getElementById(
			'visualizer'
		) as HTMLCanvasElement;
		if (!canvas) return;
		const canvasContext = canvas.getContext('2d');
		if (!canvasContext) return;
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);

		let tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = canvas.width;
		tmpCanvas.height = canvas.height;
		let tmpCtx = tmpCanvas.getContext('2d');
		if (!tmpCtx) return;
		tmpCtx.beginPath();
		draw(tmpCtx, canvas.height, canvas.width);
		tmpCtx.lineWidth = 5;
		tmpCtx.strokeStyle = 'rgb(0, 200, 0)';
		tmpCtx.stroke();
		tmpCtx.filter = 'blur(5px)';

		tmpCtx.drawImage(tmpCanvas, 0, 0);
		canvasContext.drawImage(tmpCanvas, 0, 0);

		canvasContext.lineWidth = 5;
		canvasContext.strokeStyle = 'rgb(255, 255, 255)';
		canvasContext.beginPath();
		draw(canvasContext, canvas.height, canvas.width);
		canvasContext.stroke();
	});
</script>

<canvas id="visualizer" width="640" height="100" class="visualizer"></canvas>

<style>
	.visualizer {
		width: 100%;
		max-width: 500px;
		border: 1px solid darkgray;
		border-radius: 10px;
	}
</style>
