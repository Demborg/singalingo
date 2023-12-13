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

            for(let i = 0; i < bufferLength; i++) {
                if (dataArray[i] > maxAmplitude) {
                    maxAmplitude = dataArray[i];
                    dominantFrequencyIndex = i;
                }

                const y = (1 - dataArray[i] / 255) * canvas.height;
                const x = (i / bufferLength) * canvas.width;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }
            }

            canvasContext.lineTo(canvas.width, canvas.height/2);
            canvasContext.stroke();

            const dominantFrequency = dominantFrequencyIndex * audioContext.sampleRate / analyser.fftSize;
            frequencyLabel.textContent = `Dominant Frequency: ${dominantFrequency.toFixed(2)} Hz`;
        }

        draw();
    } catch(err) {
        console.error('Error accessing audio stream:', err);
    }
});