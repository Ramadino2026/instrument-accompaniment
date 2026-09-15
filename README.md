# 🎵 Instrument Accompaniment Generator

A modern web application that allows musicians to record or upload their instrument performances and automatically generates piano accompaniments in various styles.

## Features

✨ **Recording Capabilities**
- Real-time audio recording directly from your microphone
- Live waveform visualization
- Timer to track recording duration
- Playback of your recordings

📤 **File Upload**
- Drag-and-drop audio file upload
- Support for all common audio formats
- File information display (name, duration)

🎹 **Accompaniment Generation**
- Multiple key selections (12 major keys)
- Adjustable tempo (60-200 BPM)
- Multiple accompaniment styles:
  - Classical
  - Jazz
  - Blues
  - Contemporary

🎧 **Audio Playback & Download**
- Listen to original recording
- Listen to generated piano accompaniment
- Listen to mixed combination
- Download all audio files

## Getting Started

### Prerequisites
- Modern web browser with:
  - Web Audio API support
  - MediaRecorder API support
  - getUserMedia support (for microphone access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ramadino2026/instrument-accompaniment.git
cd instrument-accompaniment
```

2. Serve the files using a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (http-server)
npx http-server

# Or using PHP
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

### Recording an Instrument

1. Click the **"🎤 Start Recording"** button
2. Allow microphone access when prompted
3. Play your instrument
4. Click **"⏹ Stop Recording"** when finished
5. Use **"▶ Play Recording"** to hear your recording

### Uploading an Audio File

1. Click the upload area or drag-and-drop an audio file
2. Select an audio file from your computer
3. The file info will be displayed

### Generating Accompaniment

1. Configure your preferences:
   - **Tempo**: Adjust BPM from 60-200
   - **Key**: Select from 12 major keys
   - **Style**: Choose classical, jazz, blues, or contemporary
   
2. Click **"✨ Generate Piano Accompaniment"**

3. Wait for processing (progress bar shows status)

4. Listen to and download your results:
   - Original recording
   - Piano accompaniment
   - Mixed together

### Downloading Results

Click the **"⬇ Download All"** button to download:
- `original-recording.wav`
- `piano-accompaniment.wav`
- `mixed-together.wav`

## File Structure

```
instrument-accompaniment/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styling
├── app.js              # Application logic
├── README.md           # This file
└── server.py           # Optional: Simple Python server
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| IE 11 | ❌ Not supported |

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Audio APIs**: Web Audio API, MediaRecorder API
- **Styling**: CSS3 Flexbox & Grid
- **Responsive Design**: Mobile, Tablet, Desktop

## Key Technologies Used

### Web Audio API
- Audio context for sound generation
- Analyser node for waveform visualization
- BufferSource for audio playback

### MediaRecorder API
- Recording audio from microphone
- Handling audio chunks
- Creating audio blobs

### Canvas API
- Real-time waveform visualization
- Frequency domain analysis

## Features Explained

### Recording
- Uses `getUserMedia()` to access microphone
- `MediaRecorder` captures audio stream
- Real-time waveform drawn with Canvas and AnalyserNode

### File Upload
- Drag-and-drop support
- File type validation
- Duration extraction from audio metadata

### Accompaniment Generation
- Simulates AI-based music generation
- Generates synthetic audio based on selected key and tempo
- Supports harmonic content and envelope shaping
- WAV format encoding

### Audio Download
- Converts audio blobs to downloadable files
- Uses HTML5 download attribute

## Future Enhancements

- 🔄 Integration with real AI music generation APIs (e.g., OpenAI Jukebox, Google MusicLM)
- 🎼 Music notation display
- 🔊 Volume and effects controls
- 📊 Audio analysis and pitch detection
- 🎯 Automatic key/tempo detection
- 💾 Cloud storage integration
- 🎵 MIDI export
- 📱 Mobile app version
- 🌐 Multi-user collaboration

## API Integration (Future)

To integrate with a real backend service:

```javascript
// Replace the simulateAccompanimentGeneration function with:
async function generateAccompaniment() {
    const formData = new FormData();
    formData.append('audio', currentAudioBlob);
    formData.append('tempo', document.getElementById('tempo').value);
    formData.append('key', document.getElementById('key').value);
    formData.append('style', document.getElementById('style').value);
    
    const response = await fetch('/api/generate-accompaniment', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    // Process result...
}
```

## Troubleshooting

### Microphone Access Denied
- Check browser permissions
- Ensure HTTPS (required for getUserMedia in production)
- Try a different browser

### No Audio in Recording
- Check microphone is connected and working
- Check system audio settings
- Verify microphone permissions in OS settings

### Cannot Upload File
- Ensure file is a valid audio format
- Check file size (browser may have limits)
- Try a different audio file

## Security Considerations

- All audio processing happens locally in the browser
- No audio data is sent to external servers (by default)
- Files are not stored on the server
- HTTPS recommended for production deployment

## Performance Tips

- Close other applications to improve audio quality
- Use a wired microphone for best results
- Allow sufficient time for audio processing
- Clear browser cache if experiencing issues

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Credits

- Built with vanilla JavaScript and Web Audio API
- Inspired by music production tools and AI accompaniment systems
- Designed for musicians and music educators

---

**Happy Music Making! 🎵**