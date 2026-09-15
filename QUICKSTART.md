# 🚀 Quick Start Guide

Get your Instrument Accompaniment Generator up and running in 2 minutes!

## Step 1: Start the Server

### Option A: Using Python (Recommended)
```bash
python3 server.py
```

### Option B: Using Node.js
```bash
npx http-server
```

### Option C: Using PHP
```bash
php -S localhost:8000
```

## Step 2: Open in Browser

Navigate to:
```
http://localhost:8000
```

You should see a beautiful purple interface with the title "🎵 Instrument Accompaniment Generator"

## Step 3: Record or Upload

### To Record:
1. Click **"🎤 Start Recording"**
2. Allow microphone access when browser asks
3. Play your instrument
4. Click **"⏹ Stop Recording"** when done
5. Click **"▶ Play Recording"** to verify

### To Upload:
1. Click the upload area or drag-and-drop an audio file
2. Select an audio file from your computer (mp3, wav, m4a, etc.)
3. File info will appear below

## Step 4: Configure Settings

1. **Tempo**: Slide to set BPM (60-200)
2. **Key**: Select your preferred key (C, G, D, A, E, B, F, Bb, Eb, Ab, Db, Gb)
3. **Style**: Choose accompaniment style
   - Classical: Elegant and formal
   - Jazz: Improvised and swing
   - Blues: Soulful and bluesy
   - Contemporary: Modern and minimalist

## Step 5: Generate Accompaniment

Click **"✨ Generate Piano Accompaniment"** and wait for processing.

You'll see a progress bar as the accompaniment is being generated.

## Step 6: Listen & Download

Once ready, you'll see three audio players:
- **Original Recording**: Your instrument performance
- **Piano Accompaniment**: The generated piano part
- **Mixed Together**: Both tracks combined

Click **"⬇ Download All"** to get all three audio files.

## Common Issues & Solutions

### Microphone Not Working?
- ✅ Ensure microphone is plugged in and detected by OS
- ✅ Check browser permissions (Chrome > Settings > Privacy > Microphone)
- ✅ Try a different browser
- ✅ Restart browser if permission was denied

### File Upload Not Working?
- ✅ Ensure file is a valid audio format
- ✅ Try a smaller file first
- ✅ Clear browser cache
- ✅ Use Chrome or Firefox for best compatibility

### Server Won't Start?
- ✅ Make sure port 8000 is not in use
- ✅ Try `python3 server.py` (not just `python`)
- ✅ Windows users: Use PowerShell instead of Command Prompt
- ✅ Mac/Linux: Prefix with `sudo` if permission denied

### Audio Quality Poor?
- ✅ Use a wired microphone for better quality
- ✅ Close other applications
- ✅ Ensure quiet background environment
- ✅ Position microphone 6-12 inches from instrument

## Tips for Best Results

🎵 **Recording Tips:**
- Use a quiet room to minimize background noise
- Position microphone optimally for your instrument
- Play at a consistent volume
- Record for at least 5-10 seconds for better analysis

⚙️ **Settings Tips:**
- Choose the correct key for your instrument
- Match the tempo to your performance speed
- Experiment with different accompaniment styles
- Classical works well for acoustic instruments
- Jazz works well for soloing instruments

📥 **Upload Tips:**
- Use high-quality audio files (320kbps or higher)
- Ensure consistent audio levels
- Mono recordings work great too
- MP3, WAV, M4A, AAC, FLAC all supported

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 49+ | ✅ Fully supported |
| Firefox | 25+ | ✅ Fully supported |
| Safari | 11+ | ✅ Fully supported |
| Edge | 79+ | ✅ Fully supported |
| Opera | 36+ | ✅ Fully supported |

## Keyboard Shortcuts

- **Space**: Play/Pause audio (when focused on player)
- **M**: Mute/Unmute
- **F**: Fullscreen (depends on browser)

## What to Expect

⏱️ **Processing Time**: Usually 5-30 seconds depending on:
- Recording length
- Accompaniment style
- Your computer's processing power

🎼 **Accompaniment Quality**: The generated accompaniment:
- Follows the key and tempo you specified
- Adapts to the accompaniment style selected
- Creates harmonic content based on common progressions
- Includes proper envelope and dynamics

## Next Steps

1. **Experiment**: Try different keys and styles
2. **Practice**: Use accompaniments for practice sessions
3. **Share**: Download and share your recordings
4. **Improve**: Try different microphone positions
5. **Feedback**: Suggest features or report issues

## Advanced: Connect to Real API

To use a real AI music generation service instead of the mock generator:

1. Sign up for an API (e.g., OpenAI, Google Magenta, etc.)
2. Get your API key
3. Modify `app.js` function `generateAccompaniment()` to call your API
4. Example API integration provided in README.md

## Troubleshooting Advanced Issues

### HTTPS Required Error
- If you see CORS or HTTPS errors, the browser requires HTTPS
- Solution: Deploy to a server with HTTPS, or use localhost (which allows HTTP)

### Large Audio Files Slow
- Browser may struggle with files larger than 10MB
- Solution: Trim your recording or use lower bit rate

### Audio Artifacts or Noise
- Generated audio may have artifacts in mock mode
- Solution: Integrate with a real music AI service
- This is a demo - production version uses professional audio APIs

## Need Help?

📧 **Issues**: Open an issue on GitHub
🐛 **Bug Report**: Include browser version and reproduction steps
💡 **Feature Request**: Suggest enhancements on GitHub Discussions

---

**Ready? Open http://localhost:8000 and start making music! 🎵**