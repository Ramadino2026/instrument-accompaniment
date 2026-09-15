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
    // Store for later use
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
        
        // Get file duration
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
    
    // Show loading
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    const tempo = document.getElementById('tempo').value;
    const key = document.getElementById('key').value;
    const style = document.getElementById('style').value;
    
    try {
        // Simulate processing
        await simulateAccompanimentGeneration(tempo, key, style);
        
        // Generate mock audio files
        const accompaniment = await generateMockAudio(tempo, key, 'piano');
        const mixed = await generateMockAudio(tempo, key, 'mixed');
        
        // Display results
        document.getElementById('originalAudio').src = window.recordedAudioUrl;
        document.getElementById('accompanimentAudio').src = URL.createObjectURL(accompaniment);
        document.getElementById('mixedAudio').src = URL.createObjectURL(mixed);
        
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error details:', error);
        showError('Error generating accompaniment: ' + error.message);
        document.getElementById('loadingSection').style.display = 'none';
    }
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

// Simple WAV generator without needing createAudioBuffer
function generateSimpleWAV(duration, frequency, sampleRate) {
    const samples = sampleRate * duration;
    const wav = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        // Simple sine wave
        wav[i] = 0.3 * Math.sin(2 * Math.PI * frequency * t);
    }
    
    return encodeWAV(wav, sampleRate);
}

async function generateMockAudio(tempo, key, type) {
    return new Promise((resolve) => {
        const duration = 5; // seconds
        const sampleRate = 44100;
        
        // Generate simple tone based on key
        const keyFrequencies = {
            'C': 261.63,
            'G': 392.00,
            'D': 293.66,
            'A': 440.00,
            'E': 329.63,
            'B': 493.88,
            'F': 349.23,
            'Bb': 466.16,
            'Eb': 311.13,
            'Ab': 415.30,
            'Db': 277.18,
            'Gb': 369.99
        };
        
        const frequency = keyFrequencies[key] || 440;
        const wavBlob = generateSimpleWAV(duration, frequency, sampleRate);
        resolve(wavBlob);
    });
}

function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    const channelCount = 1;
    const byteRate = sampleRate * channelCount * 2;
    const blockAlign = channelCount * 2;
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, channelCount, true); // channels
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, byteRate, true); // byte rate
    view.setUint16(32, blockAlign, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true); // data chunk size
    
    // Write samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
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
    // Reset all inputs
    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('generateBtn').disabled = true;
    
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('audioFile').value = '';
    
    // Hide results
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    
    currentAudioBlob = null;
    recordedChunks = [];
    
    // Scroll to top
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
    // Set default tempo display
    document.getElementById('tempoValue').textContent = '120';
});
