<script lang="ts">
	import { afterUpdate } from 'svelte';
	export let dataArray: Uint8Array;

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

		for (let i = 0; i < dataArray.length; i++) {
			const y: number = (1 - dataArray[i] / 255) * canvas.height;
			const x: number = (i / dataArray.length) * canvas.width;

			if (i === 0) {
				canvasContext.moveTo(x, y);
			} else {
				canvasContext.lineTo(x, y);
			}
		}

		canvasContext.lineTo(canvas.width, canvas.height / 2);
		canvasContext.stroke();
	});
</script>

<canvas id="visualizer" width="640" height="100" class="visualizer"></canvas>

<style>
	.visualizer {
		width: 100%;
		max-width: 500px;
	}
</style>
