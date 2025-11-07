# 🎵 MusicTab - Local MP3 Player

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0-orange.svg)](CHANGELOG.md)

Transform your Chrome browser into a powerful local music player. Play your MP3 files directly from your computer with a beautiful, modern interface featuring album artwork and artist information.

---

## ✨ Features

### 🎧 Core Features
- **Local File Playback** - Play MP3, WAV, FLAC, OGG, and other audio formats directly from your device
- **iTunes Metadata Integration** - Automatically fetch album covers, artist photos, and track information
- **Beautiful Interface** - Clean, modern design that puts your music front and center
- **Playlist Management** - Create and manage your playlists with ease
- **Audio Visualizer** - Watch your music come to life with built-in visualizations
- **Keyboard Shortcuts** - Control playback without touching your mouse

### 🔒 Privacy First
- ✅ All files processed locally on your device
- ✅ No file uploads - your music stays on your computer
- ✅ Metadata requests only fetch public information
- ✅ No tracking, no ads, no data collection

### 🎨 User Experience
- Responsive design - works on all screen sizes
- Album artwork display
- Artist information and photos
- Intuitive playback controls
- Volume control and progress bar
- Track duration and time display

---

## 📥 Installation

### From Chrome Web Store (Recommended)
1. Visit the [MusicTab Chrome Web Store page](#) *(coming soon)*
2. Click "Add to Chrome"
3. Enjoy your music!

### Manual Installation
1. Download the [latest release](https://github.com/bwalid13/musictab/releases)
2. Extract the ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked"
6. Select the extracted folder
7. Click the MusicTab icon to start!

---

## 🚀 Quick Start

1. **Open MusicTab**
   - Click the MusicTab icon in your browser toolbar
   - Or open a new tab (if configured)

2. **Add Your Music**
   - Click "Add Files" or drag and drop audio files
   - MusicTab supports MP3, WAV, FLAC, OGG, and more

3. **Enjoy!**
   - Album covers and artist info load automatically
   - Use controls or keyboard shortcuts to navigate

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Play/Pause | `Space` |
| Next Track | `→` or `N` |
| Previous Track | `←` or `P` |
| Volume Up | `↑` |
| Volume Down | `↓` |
| Mute/Unmute | `M` |
| Shuffle | `S` |
| Repeat | `R` |

---

## 🎵 Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- FLAC (.flac)
- OGG (.ogg)
- M4A (.m4a)
- AAC (.aac)
- And more...

---

## 🔧 Technical Details

### Built With
- Vanilla JavaScript (no frameworks)
- HTML5 Audio API
- Chrome Extension Manifest V3
- iTunes Search API
- Wikipedia API
- jsmediatags library for ID3 tag reading

### Permissions
- `storage` - Save preferences locally
- `tabs` - Open player in new tab
- `https://itunes.apple.com/*` - Fetch album artwork
- `https://*.wikipedia.org/*` - Fetch artist information

See [Privacy Policy](PRIVACY_POLICY.md) for detailed information.

---

## 🛠️ Development

### Project Structure
```
musictab/
├── manifest.json           # Extension configuration
├── background.js           # Service worker
├── player.html            # Player interface
├── player.js              # Player logic
├── jsmediatags.min.js     # ID3 tag reader
├── icon16.png             # Extension icon (16x16)
├── icon48.png             # Extension icon (48x48)
├── icon128.png            # Extension icon (128x128)
└── package.ps1            # Build script
```

### Building
```powershell
# Create distribution package
.\package.ps1
```

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔐 Privacy

MusicTab respects your privacy:
- No data collection
- No tracking or analytics
- All processing happens locally
- Music files never leave your device

Read our full [Privacy Policy](PRIVACY_POLICY.md).

---

## 📞 Contact & Support

- **Email:** bwalid13@gmail.com
- **GitHub:** [@bwalid13](https://github.com/bwalid13)
- **Issues:** [Report a bug](https://github.com/bwalid13/musictab/issues)

---

## 🙏 Acknowledgments

- [jsmediatags](https://github.com/aadsm/jsmediatags) - ID3 tag reading
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) - Metadata and artwork
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) - Artist information

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

## ⭐ Show Your Support

If you like MusicTab, please:
- ⭐ Star this repository
- 🐛 Report bugs or suggest features in [Issues](https://github.com/bwalid13/musictab/issues)
- 📢 Share with your friends
- ✍️ Leave a review on Chrome Web Store

---

**Made with ❤️ for music lovers**

*Enjoy your local music collection with style!*
