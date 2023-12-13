function frequencyToNoteName(frequency) {
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

document.getElementById('startButton').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        source.connect(analyser);
        analyser.fftSize = 2048;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const frequencyLabel = document.createElement('p');
        document.body.appendChild(frequencyLabel);

        // Define the frequency range for human voice
        const minFreq = 80; // 80 Hz
        const maxFreq = 1100; // 1100 Hz
        const minIndex = Math.floor(minFreq / (audioContext.sampleRate / analyser.fftSize));
        const maxIndex = Math.ceil(maxFreq / (audioContext.sampleRate / analyser.fftSize));

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const canvas = document.getElementById('visualizer');
            const canvasContext = canvas.getContext('2d');
            canvasContext.fillStyle = 'rgb(200, 200, 200)';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);

            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'rgb(0, 0, 0)';
            canvasContext.beginPath();

            let maxAmplitude = -Infinity;
            let dominantFrequencyIndex = 0;

            for(let i = minIndex; i <= maxIndex; i++) {
                if (dataArray[i] > maxAmplitude) {
                    maxAmplitude = dataArray[i];
                    dominantFrequencyIndex = i;
                }

                const y = (1 - dataArray[i] / 255) * canvas.height;
                const x = ((i - minIndex) / (maxIndex - minIndex)) * canvas.width;

                if (i === minIndex) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }
            }

            canvasContext.lineTo(canvas.width, canvas.height/2);
            canvasContext.stroke();

            const dominantFrequency = dominantFrequencyIndex * audioContext.sampleRate / analyser.fftSize;
            frequencyLabel.textContent = `Dominant Frequency: ${dominantFrequency.toFixed(2)} Hz ${frequencyToNoteName(dominantFrequency)}`;
        }

        draw();
    } catch(err) {
        console.error('Error accessing audio stream:', err);
    }
});