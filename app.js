// Audio context and variables
let audioContext;
let mediaRecorder;
let recordedChunks = [];
let recordingStartTime;
let timerInterval;
let currentAudioBlob;
let analyser;
let dataArray;

// Initialize audio context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// ==================== RECORDING FUNCTIONALITY ====================

// Start recording
document.getElementById('recordBtn').addEventListener('click', async () => {
    try {
        initAudioContext();
        recordedChunks = [];
        recordingStartTime = Date.now();
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        // Setup audio analysis for waveform
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        
        mediaRecorder.ondataavailable = (e) => {
            recordedChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
            currentAudioBlob = audioBlob;
            displayRecordedAudio(audioBlob);
        };
        
        mediaRecorder.start();
        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('generateBtn').disabled = false;
        
        // Start timer
        startTimer();
        // Draw waveform
        drawWaveform();
        
    } catch (error) {
        showError('Error accessing microphone: ' + error.message);
    }
});

// Stop recording
document.getElementById('stopBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    
    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('playBtn').disabled = false;
    
    clearInterval(timerInterval);
});

// Timer
function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = 
            String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }, 1000);
}

// Draw waveform
function drawWaveform() {
    const canvas = document.getElementById('waveform');
    const canvasCtx = canvas.getContext('2d');
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    function draw() {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = 'rgb(245, 246, 250)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(108, 92, 231)';
        canvasCtx.beginPath();
        
        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
            
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }
    
    draw();
}

// Play recorded audio
document.getElementById('playBtn').addEventListener('click', () => {
    if (currentAudioBlob) {
        const audioUrl = URL.createObjectURL(currentAudioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    }
});

// Display recorded audio
function displayRecordedAudio(blob) {
    const audioUrl = URL.createObjectURL(blob);
    window.recordedAudioUrl = audioUrl;
}

// ==================== FILE UPLOAD FUNCTIONALITY ====================

const uploadArea = document.getElementById('uploadArea');
const audioFileInput = document.getElementById('audioFile');

uploadArea.addEventListener('click', () => {
    audioFileInput.click();
});

audioFileInput.addEventListener('change', handleFileSelect);

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        audioFileInput.files = files;
        handleFileSelect({ target: { files } });
    }
});

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        currentAudioBlob = file;
        
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileDuration').textContent = 'Loading...';
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('generateBtn').disabled = false;
        
        const audio = new Audio(URL.createObjectURL(file));
        audio.onloadedmetadata = () => {
            document.getElementById('fileDuration').textContent = 
                Math.round(audio.duration * 10) / 10;
            window.recordedAudioUrl = URL.createObjectURL(file);
        };
    }
}

// ==================== SETTINGS ====================

document.getElementById('tempo').addEventListener('input', (e) => {
    document.getElementById('tempoValue').textContent = e.target.value;
});

// ==================== GENERATE ACCOMPANIMENT ====================

document.getElementById('generateBtn').addEventListener('click', generateAccompaniment);

async function generateAccompaniment() {
    if (!currentAudioBlob) {
        showError('Please record or upload an audio file first');
        return;
    }
    
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    const tempo = document.getElementById('tempo').value;
    const key = document.getElementById('key').value;
    const style = document.getElementById('style').value;
    
    try {
        await simulateAccompanimentGeneration(tempo, key, style);
        
        // Get the duration of the original recording
        const originalDuration = await getAudioDuration(window.recordedAudioUrl);
        console.log('Original duration:', originalDuration);
        
        const accompanimentUrl = generateToneAudio(key, originalDuration);
        const mixedUrl = await generateMixedAudio(window.recordedAudioUrl, accompanimentUrl, originalDuration);
        
        document.getElementById('originalAudio').src = window.recordedAudioUrl;
        document.getElementById('accompanimentAudio').src = accompanimentUrl;
        document.getElementById('mixedAudio').src = mixedUrl;
        
        console.log('Original:', window.recordedAudioUrl);
        console.log('Accompaniment:', accompanimentUrl);
        console.log('Mixed:', mixedUrl);
        
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Full error:', error);
        showError('Error: ' + error.message);
        document.getElementById('loadingSection').style.display = 'none';
    }
}

// Get duration of audio from URL
function getAudioDuration(audioUrl) {
    return new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
            console.log('Audio metadata loaded, duration:', audio.duration);
            resolve(audio.duration);
        };
        audio.onerror = () => {
            console.log('Error loading audio, using default 5 seconds');
            resolve(5);
        };
    });
}

async function simulateAccompanimentGeneration(tempo, key, style) {
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            document.getElementById('progress').style.width = progress + '%';
            
            if (progress === 100) {
                clearInterval(interval);
                resolve();
            }
        }, 300);
    });
}

// Generate piano accompaniment tone with proper duration
function generateToneAudio(key, duration = 5) {
    const frequencies = {
        'C': 261.63, 'G': 392.00, 'D': 293.66, 'A': 440.00,
        'E': 329.63, 'B': 493.88, 'F': 349.23, 'Bb': 466.16,
        'Eb': 311.13, 'Ab': 415.30, 'Db': 277.18, 'Gb': 369.99
    };
    
    const frequency = frequencies[key] || 440;
    const sampleRate = 44100;
    const samples = Math.floor(duration * sampleRate);
    const audioData = new Float32Array(samples);
    
    // Generate sine wave with proper amplitude
    for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        // Generate a chord progression for more musical sound
        const freq1 = frequency;
        const freq2 = frequency * 1.25; // major third
        const freq3 = frequency * 1.5;  // perfect fifth
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t);
        const wave2 = Math.sin(2 * Math.PI * freq2 * t);
        const wave3 = Math.sin(2 * Math.PI * freq3 * t);
        
        // Mix the waves with envelope for fade in/out
        const envelope = Math.min(1, Math.min(i / (sampleRate * 0.1), (samples - i) / (sampleRate * 0.1)));
        audioData[i] = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2) * 0.6 * envelope;
    }
    
    const wavBlob = createWavBlob(audioData, sampleRate);
    const url = URL.createObjectURL(wavBlob);
    console.log('Generated tone URL:', url, 'duration:', duration);
    return url;
}

// Generate mixed audio (original + accompaniment)
async function generateMixedAudio(originalUrl, accompanimentUrl, duration) {
    return new Promise((resolve) => {
        const ctx = initAudioContext();
        const sampleRate = ctx.sampleRate;
        const totalSamples = Math.floor(duration * sampleRate);
        const mixedAudioData = new Float32Array(totalSamples);
        
        // Load both audio sources
        Promise.all([
            fetchAudioData(originalUrl, duration),
            fetchAudioData(accompanimentUrl, duration)
        ]).then(([originalData, accompanimentData]) => {
            // Mix the two audio streams
            for (let i = 0; i < totalSamples; i++) {
                const orig = originalData[i] || 0;
                const accomp = accompanimentData[i] || 0;
                // Mix with equal volume
                mixedAudioData[i] = (orig * 0.5 + accomp * 0.5) * 0.9;
            }
            
            const wavBlob = createWavBlob(mixedAudioData, sampleRate);
            const url = URL.createObjectURL(wavBlob);
            console.log('Generated mixed URL:', url);
            resolve(url);
        }).catch(err => {
            console.error('Error mixing audio:', err);
            // Fallback: just return the accompaniment
            resolve(accompanimentUrl);
        });
    });
}

// Fetch audio data from URL
function fetchAudioData(audioUrl, duration) {
    return new Promise((resolve, reject) => {
        const ctx = initAudioContext();
        const sampleRate = ctx.sampleRate;
        
        fetch(audioUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                ctx.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    const audioData = new Float32Array(Math.floor(duration * sampleRate));
                    const channelData = audioBuffer.getChannelData(0);
                    
                    for (let i = 0; i < audioData.length; i++) {
                        audioData[i] = channelData[i] || 0;
                    }
                    resolve(audioData);
                }, (err) => {
                    console.error('Decode error:', err);
                    reject(err);
                });
            })
            .catch(err => {
                console.error('Fetch error:', err);
                reject(err);
            });
    });
}

// Create WAV blob from audio data
function createWavBlob(audioData, sampleRate) {
    const wavHeader = createWavHeader(audioData.length * 2, sampleRate);
    const pcmData = float32ToPcm16(audioData);
    const blob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    return blob;
}

// Create WAV file header with correct format
function createWavHeader(dataSize, sampleRate) {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    
    const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk1Size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * 2, true); // byteRate
    view.setUint16(32, 2, true); // blockAlign
    view.setUint16(34, 16, true); // bitsPerSample
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    return new Uint8Array(buffer);
}

// Convert float32 to PCM16
function float32ToPcm16(float32Array) {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const sample = Math.max(-1, Math.min(1, float32Array[i]));
        pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    return pcm16.buffer;
}

// ==================== DOWNLOAD ====================

document.getElementById('downloadBtn').addEventListener('click', () => {
    const original = document.getElementById('originalAudio').src;
    const accompaniment = document.getElementById('accompanimentAudio').src;
    const mixed = document.getElementById('mixedAudio').src;
    
    downloadFile(original, 'original-recording.wav');
    setTimeout(() => downloadFile(accompaniment, 'piano-accompaniment.wav'), 500);
    setTimeout(() => downloadFile(mixed, 'mixed-together.wav'), 1000);
});

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ==================== RESET ====================

document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('generateBtn').disabled = true;
    
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('audioFile').value = '';
    
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    
    currentAudioBlob = null;
    recordedChunks = [];
    
    window.scrollTo(0, 0);
});

// ==================== ERROR HANDLING ====================

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('tempoValue').textContent = '120';
});
