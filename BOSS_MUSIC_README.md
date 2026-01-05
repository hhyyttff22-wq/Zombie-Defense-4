# Boss Music Setup

This game now supports MP4 audio files for boss music! Here's how to add your custom boss tracks:

## 🎵 Adding Boss Music Files

### Step 1: Prepare Your MP4 Files
- Convert your music to MP4 format (or use MP4 files that contain audio)
- **Recommended:** Use MP3, AAC, or OGG for better compatibility, but MP4 works too
- Keep files under 10MB for web performance
- Boss music should loop seamlessly

### Step 2: File Naming
Place your audio files in the `public/assets/` folder:
- `Boss.mp3.mp3` - For Interceptor (wave 10) and Origin Enforcer (wave 12)
- `CommanderReign.mp3` - For Zombie Commander (wave 15)
- `OverseersArrival.mp3` - For Overseer (wave 20), falls back to procedural bass music if not found

### Step 3: Supported Formats
The game will automatically detect and play:
- MP3 (recommended)
- AAC
- OGG
- WAV
- MP4 (with audio track)

### Step 4: Fallback System
If your audio files aren't found, the game will automatically use the original procedural music as backup.

## 🔧 Technical Details

- Audio files are loaded asynchronously when the game starts
- Boss music loops continuously during boss fights
- Volume is set to 60% to not overpower sound effects
- Each boss has specific music preferences:
  - **Interceptor & Origin Enforcer**: `Boss.mp3.mp3` → procedural fallback
  - **Zombie Commander**: `CommanderReign.mp3` → `Boss.mp3.mp3` → procedural fallback
  - **Overseer**: `OverseersArrival.mp3` → procedural bass music fallback
- Modern browsers require user interaction before audio plays

## 🎮 How It Works

1. When a boss spawns, the game checks for audio files
2. If found, it plays your custom music
3. If not found, it generates procedural boss music
4. Music stops when the boss is defeated

## 📁 File Structure
```
your-game-folder/
├── public/
│   └── assets/
│       ├── boss_music.mp4    # Regular boss music
│       └── king_music.mp4   # Overseer music
├── src/
├── dist/                    # Built game files
└── BOSS_MUSIC_README.md     # This file
```

## 🎼 Audio Recommendations

- **Length:** 1-3 minutes (will loop)
- **Style:** Epic, intense, cyberpunk/orchestral
- **Format:** MP4 with AAC audio (best compatibility)
- **Bitrate:** 128-320 kbps
- **Sample Rate:** 44.1 kHz

Enjoy your custom boss music! 🎵⚔️