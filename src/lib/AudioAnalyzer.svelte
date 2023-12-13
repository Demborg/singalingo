<script lang="ts">
    import { onMount } from 'svelte';
    // import type { AnalyserNode, AudioContext } from 'standardized-audio-context';

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let dominantFrequency: number = 0;

    onMount(() => {
        // Deferred initialization to ensure user gesture
    });

    async function initAudio(): Promise<void> {
        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            draw();
        } catch(err) {
            console.error('Error accessing audio stream:', err);
        }
    }

    function draw(): void {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const canvas: HTMLCanvasElement | null = document.getElementById('visualizer') as HTMLCanvasElement;
        if (!canvas) return;
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) return;
        
        canvasContext.fillStyle = 'rgb(200, 200, 200)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(0, 0, 0)';
        canvasContext.beginPath();

        let maxAmplitude: number = -Infinity;
        let dominantFrequencyIndex: number = 0;

        for(let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxAmplitude) {
                maxAmplitude = dataArray[i];
                dominantFrequencyIndex = i;
            }

            const y: number = (1 - dataArray[i] / 255) * canvas.height;
            const x: number = (i / dataArray.length) * canvas.width;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
        }

        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();

        dominantFrequency = dominantFrequencyIndex * audioContext.sampleRate / analyser.fftSize;
    }

    function frequencyToNoteName(frequency: number): string {
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
</script>

<button on:click={initAudio}>Start Microphone Input</button>
<canvas id="visualizer" width="640" height="100"></canvas>
<p>Dominant Frequency: {dominantFrequency.toFixed(2)} Hz</p>
<p>Note: {frequencyToNoteName(dominantFrequency)}</p>