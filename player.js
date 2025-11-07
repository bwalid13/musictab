// MusicTab Player - Main Script
// Handles MP3 playback, folder selection, iTunes metadata integration

(function() {
  'use strict';

  // ========================================
  // STATE
  // ========================================
  let playlist = [];
  let currentTrackIndex = 0;
  let isPlaying = false;
  let audioContext = null;
  let analyser = null;
  let ambianceEnabled = true;
  let ambianceAnimationId = null;
  let currentTheme = 'ios';
  let customThemeSettings = {};
  let isShuffleEnabled = false;
  let isLoopEnabled = false;
  let originalPlaylist = [];
  // References to playlist DOM items for incremental updates
  let playlistItemNodes = [];
  
  const THEMES = {
    ios: {
      name: 'iOS White',
      icon: '📱',
      category: 'preset',
      values: {
        hue: 210,
        controlBarOpacity: 0.12,
        controlBarBlur: 75,
        controlBarBg: 'rgba(255, 255, 255, 0.12)',
        controlBarBorder: 'rgba(255, 255, 255, 0.25)',
        controlBarBorderRadius: 28,
        buttonBgOpacity: 0.08,
        buttonBorderOpacity: 0.18,
        buttonHoverBgOpacity: 0.22,
        textColor: 'rgba(255, 255, 255, 0.95)',
        progressGradient: 'linear-gradient(90deg, #0A84FF 0%, #64D2FF 50%, #B4E8FF 100%)',
        progressShadow: 'rgba(10, 132, 255, 0.6)',
        // New complete identity parameters
        panelSaturation: 100,
        panelContrast: 110,
        panelBrightness: 120,
        themeColorSaturation: 80,
        themeColorLightness: 55,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.8,
        // Control layout additions
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 110,
        squareButtons: false,
        buttonGlow: 0.6
      }
    },
    windows11: {
      name: 'Windows 11',
      icon: '🪟',
      category: 'preset',
      values: {
        hue: 210,
        controlBarOpacity: 0.85,
        controlBarBlur: 20,
        controlBarBg: 'rgba(32, 32, 36, 0.85)',
        controlBarBorder: 'rgba(255, 255, 255, 0.1)',
        controlBarBorderRadius: 8,
        buttonBgOpacity: 0.2,
        buttonBorderOpacity: 0.15,
        buttonHoverBgOpacity: 0.35,
        textColor: 'rgba(255, 255, 255, 0.96)',
        progressGradient: 'linear-gradient(90deg, #0078D4 0%, #50A0E8 50%, #90D0FF 100%)',
        progressShadow: 'rgba(0, 120, 212, 0.6)',
        panelSaturation: 95,
        panelContrast: 120,
        panelBrightness: 95,
        themeColorSaturation: 75,
        themeColorLightness: 50,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.7,
        scale: 1,
        buttonSize: 50,
        buttonSpacing: 12,
        buttonSaturation: 100,
        squareButtons: false,
        buttonGlow: 0.4
      }
    },
    neumorphism: {
      name: 'Neumorphism',
      icon: '🌙',
      category: 'preset',
      values: {
        hue: 200,
        controlBarOpacity: 0.25,
        controlBarBlur: 30,
        controlBarBg: 'rgba(230, 230, 240, 0.25)',
        controlBarBorder: 'rgba(255, 255, 255, 0.4)',
        controlBarBorderRadius: 24,
        buttonBgOpacity: 0.12,
        buttonBorderOpacity: 0.2,
        buttonHoverBgOpacity: 0.25,
        textColor: 'rgba(255, 255, 255, 0.98)',
        progressGradient: 'linear-gradient(90deg, #B8C6DB 0%, #D5E1EF 50%, #E8F4FF 100%)',
        progressShadow: 'rgba(184, 198, 219, 0.5)',
        panelSaturation: 120,
        panelContrast: 105,
        panelBrightness: 110,
        themeColorSaturation: 40,
        themeColorLightness: 70,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.5,
        scale: 1,
        buttonSize: 54,
        buttonSpacing: 16,
        buttonSaturation: 90,
        squareButtons: true,
        buttonGlow: 0.35
      }
    },
    darkmode: {
      name: 'Pure Black',
      icon: '⬛',
      category: 'preset',
      values: {
        hue: 0,
        controlBarOpacity: 0.95,
        controlBarBlur: 10,
        controlBarBg: 'rgba(0, 0, 0, 0.95)',
        controlBarBorder: 'rgba(50, 50, 50, 0.8)',
        controlBarBorderRadius: 18,
        buttonBgOpacity: 0.25,
        buttonBorderOpacity: 0.3,
        buttonHoverBgOpacity: 0.4,
        textColor: 'rgba(255, 255, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #FFFFFF 0%, #E0E0E0 50%, #C0C0C0 100%)',
        progressShadow: 'rgba(255, 255, 255, 0.3)',
        panelSaturation: 80,
        panelContrast: 130,
        panelBrightness: 80,
        themeColorSaturation: 1,
        themeColorLightness: 85,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.4,
        scale: 1,
        buttonSize: 50,
        buttonSpacing: 12,
        buttonSaturation: 80,
        squareButtons: false,
        buttonGlow: 0.25
      }
    },
    glassmorphism: {
      name: 'Glass',
      icon: '�',
      category: 'preset',
      values: {
        hue: 180,
        controlBarOpacity: 0.08,
        controlBarBlur: 100,
        controlBarBg: 'rgba(255, 255, 255, 0.08)',
        controlBarBorder: 'rgba(255, 255, 255, 0.18)',
        controlBarBorderRadius: 32,
        buttonBgOpacity: 0.1,
        buttonBorderOpacity: 0.15,
        buttonHoverBgOpacity: 0.2,
        textColor: 'rgba(255, 255, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #00FFF0 0%, #00D4FF 50%, #00B8FF 100%)',
        progressShadow: 'rgba(0, 255, 240, 0.7)',
        panelSaturation: 200,
        panelContrast: 95,
        panelBrightness: 115,
        themeColorSaturation: 85,
        themeColorLightness: 55,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.2,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 120,
        squareButtons: false,
        buttonGlow: 0.8
      }
    },
    neon: {
      name: 'Neon Purple',
      icon: '💜',
      category: 'preset',
      values: {
        hue: 280,
        controlBarOpacity: 0.35,
        controlBarBlur: 25,
        controlBarBg: 'rgba(80, 20, 120, 0.35)',
        controlBarBorder: 'rgba(200, 50, 255, 0.6)',
        controlBarBorderRadius: 12,
        buttonBgOpacity: 0.25,
        buttonBorderOpacity: 0.5,
        buttonHoverBgOpacity: 0.45,
        textColor: 'rgba(255, 255, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #B800FF 0%, #FF00FF 50%, #FF70FF 100%)',
        progressShadow: 'rgba(184, 0, 255, 0.9)',
        panelSaturation: 250,
        panelContrast: 115,
        panelBrightness: 105,
        themeColorSaturation: 95,
        themeColorLightness: 60,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.5,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 140,
        squareButtons: false,
        buttonGlow: 0.9
      }
    },
    synthwave: {
      name: 'Synthwave',
      icon: '🌴',
      category: 'preset',
      values: {
        hue: 320,
        controlBarOpacity: 0.6,
        controlBarBlur: 15,
        controlBarBg: 'rgba(15, 5, 30, 0.6)',
        controlBarBorder: 'rgba(255, 0, 128, 0.5)',
        controlBarBorderRadius: 6,
        buttonBgOpacity: 0.3,
        buttonBorderOpacity: 0.45,
        buttonHoverBgOpacity: 0.5,
        textColor: 'rgba(255, 100, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #FF006E 0%, #FF1A8C 50%, #00F0FF 100%)',
        progressShadow: 'rgba(255, 0, 110, 0.8)',
        panelSaturation: 280,
        panelContrast: 125,
        panelBrightness: 90,
        themeColorSaturation: 100,
        themeColorLightness: 55,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.8,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 16,
        buttonSaturation: 140,
        squareButtons: false,
        buttonGlow: 1
      }
    },
    aurora: {
      name: 'Aurora Green',
      icon: '🌌',
      category: 'preset',
      values: {
        hue: 150,
        controlBarOpacity: 0.15,
        controlBarBlur: 80,
        controlBarBg: 'rgba(0, 80, 60, 0.15)',
        controlBarBorder: 'rgba(0, 255, 150, 0.3)',
        controlBarBorderRadius: 26,
        buttonBgOpacity: 0.15,
        buttonBorderOpacity: 0.25,
        buttonHoverBgOpacity: 0.3,
        textColor: 'rgba(200, 255, 230, 1)',
        progressGradient: 'linear-gradient(90deg, #00FF8F 0%, #00FFB8 50%, #00FFD4 100%)',
        progressShadow: 'rgba(0, 255, 143, 0.7)',
        panelSaturation: 220,
        panelContrast: 100,
        panelBrightness: 120,
        themeColorSaturation: 90,
        themeColorLightness: 65,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.1,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 120,
        squareButtons: false,
        buttonGlow: 0.7
      }
    },
    sunset: {
      name: 'Sunset Orange',
      icon: '🌅',
      category: 'preset',
      values: {
        hue: 25,
        controlBarOpacity: 0.28,
        controlBarBlur: 45,
        controlBarBg: 'rgba(80, 40, 20, 0.28)',
        controlBarBorder: 'rgba(255, 120, 50, 0.35)',
        controlBarBorderRadius: 20,
        buttonBgOpacity: 0.2,
        buttonBorderOpacity: 0.3,
        buttonHoverBgOpacity: 0.35,
        textColor: 'rgba(255, 200, 150, 1)',
        progressGradient: 'linear-gradient(90deg, #FF6B35 0%, #FF8C42 50%, #FFB347 100%)',
        progressShadow: 'rgba(255, 107, 53, 0.6)',
        panelSaturation: 160,
        panelContrast: 110,
        panelBrightness: 105,
        themeColorSaturation: 70,
        themeColorLightness: 58,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.9,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 110,
        squareButtons: false,
        buttonGlow: 0.6
      }
    },
    matrix: {
      name: 'Matrix',
      icon: '🟢',
      category: 'preset',
      values: {
        hue: 120,
        controlBarOpacity: 0.75,
        controlBarBlur: 15,
        controlBarBg: 'rgba(0, 20, 0, 0.75)',
        controlBarBorder: 'rgba(0, 255, 0, 0.4)',
        controlBarBorderRadius: 4,
        buttonBgOpacity: 0.3,
        buttonBorderOpacity: 0.5,
        buttonHoverBgOpacity: 0.5,
        textColor: 'rgba(0, 255, 0, 1)',
        progressGradient: 'linear-gradient(90deg, #00FF00 0%, #00DD00 50%, #00BB00 100%)',
        progressShadow: 'rgba(0, 255, 0, 0.8)',
        panelSaturation: 300,
        panelContrast: 140,
        panelBrightness: 85,
        themeColorSaturation: 100,
        themeColorLightness: 45,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.3,
        scale: 1,
        buttonSize: 50,
        buttonSpacing: 12,
        buttonSaturation: 150,
        squareButtons: true,
        buttonGlow: 0.8
      }
    },
    ocean: {
      name: 'Deep Ocean',
      icon: '🌊',
      category: 'preset',
      values: {
        hue: 200,
        controlBarOpacity: 0.4,
        controlBarBlur: 50,
        controlBarBg: 'rgba(10, 30, 50, 0.4)',
        controlBarBorder: 'rgba(30, 150, 255, 0.3)',
        controlBarBorderRadius: 22,
        buttonBgOpacity: 0.2,
        buttonBorderOpacity: 0.3,
        buttonHoverBgOpacity: 0.35,
        textColor: 'rgba(150, 220, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #0077BE 0%, #00A8E8 50%, #00D9FF 100%)',
        progressShadow: 'rgba(0, 119, 190, 0.7)',
        panelSaturation: 170,
        panelContrast: 105,
        panelBrightness: 110,
        themeColorSaturation: 78,
        themeColorLightness: 52,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.95,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 14,
        buttonSaturation: 110,
        squareButtons: false,
        buttonGlow: 0.65
      }
    },
    cyberpunk: {
      name: 'Cyberpunk',
      icon: '🤖',
      category: 'preset',
      values: {
        hue: 300,
        controlBarOpacity: 0.7,
        controlBarBlur: 20,
        controlBarBg: 'rgba(20, 0, 40, 0.7)',
        controlBarBorder: 'rgba(255, 0, 255, 0.6)',
        controlBarBorderRadius: 8,
        buttonBgOpacity: 0.35,
        buttonBorderOpacity: 0.55,
        buttonHoverBgOpacity: 0.55,
        textColor: 'rgba(255, 50, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #FF00FF 0%, #00FFFF 50%, #FFFF00 100%)',
        progressShadow: 'rgba(255, 0, 255, 0.9)',
        panelSaturation: 270,
        panelContrast: 130,
        panelBrightness: 95,
        themeColorSaturation: 98,
        themeColorLightness: 58,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 1.6,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 16,
        buttonSaturation: 160,
        squareButtons: false,
        buttonGlow: 1
      }
    },
    mint: {
      name: 'Mint Fresh',
      icon: '🍃',
      category: 'preset',
      values: {
        hue: 160,
        controlBarOpacity: 0.2,
        controlBarBlur: 65,
        controlBarBg: 'rgba(200, 255, 235, 0.2)',
        controlBarBorder: 'rgba(100, 255, 200, 0.3)',
        controlBarBorderRadius: 28,
        buttonBgOpacity: 0.15,
        buttonBorderOpacity: 0.25,
        buttonHoverBgOpacity: 0.3,
        textColor: 'rgba(255, 255, 255, 1)',
        progressGradient: 'linear-gradient(90deg, #00E5A0 0%, #00FFB8 50%, #70FFD6 100%)',
        progressShadow: 'rgba(0, 229, 160, 0.6)',
        panelSaturation: 150,
        panelContrast: 98,
        panelBrightness: 118,
        themeColorSaturation: 65,
        themeColorLightness: 68,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.85,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 12,
        buttonSaturation: 120,
        squareButtons: false,
        buttonGlow: 0.6
      }
    },
    cherry: {
      name: 'Cherry Blossom',
      icon: '🌸',
      category: 'preset',
      values: {
        hue: 330,
        controlBarOpacity: 0.25,
        controlBarBlur: 55,
        controlBarBg: 'rgba(255, 200, 230, 0.25)',
        controlBarBorder: 'rgba(255, 150, 200, 0.35)',
        controlBarBorderRadius: 24,
        buttonBgOpacity: 0.18,
        buttonBorderOpacity: 0.28,
        buttonHoverBgOpacity: 0.33,
        textColor: 'rgba(255, 200, 230, 1)',
        progressGradient: 'linear-gradient(90deg, #FF94C2 0%, #FFB3D9 50%, #FFD1E8 100%)',
        progressShadow: 'rgba(255, 148, 194, 0.6)',
        panelSaturation: 190,
        panelContrast: 102,
        panelBrightness: 108,
        themeColorSaturation: 68,
        themeColorLightness: 72,
        shadowEnabled: true,
        backgroundEnabled: true,
        glowIntensity: 0.75,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 12,
        buttonSaturation: 110,
        squareButtons: false,
        buttonGlow: 0.5
      }
    },
    stealth: {
      name: 'Stealth (No Bar)',
      icon: '🕶️',
      category: 'preset',
      values: {
        hue: 210,
        controlBarOpacity: 0,
        controlBarBlur: 40,
        controlBarBg: 'rgba(255, 255, 255, 0.0)',
        controlBarBorder: 'rgba(255, 255, 255, 0.0)',
        controlBarBorderRadius: 24,
        buttonBgOpacity: 0.15,
        buttonBorderOpacity: 0.25,
        buttonHoverBgOpacity: 0.3,
        textColor: 'rgba(255, 255, 255, 0.95)',
        progressGradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        progressShadow: 'rgba(102, 126, 234, 0.6)',
        panelSaturation: 140,
        panelContrast: 110,
        panelBrightness: 110,
        themeColorSaturation: 70,
        themeColorLightness: 60,
        shadowEnabled: false,
        backgroundEnabled: false,
        glowIntensity: 0.7,
        scale: 1,
        buttonSize: 50,
        buttonSpacing: 14,
        buttonSaturation: 110,
        squareButtons: false,
        buttonGlow: 0.5
      }
    },
    flat: {
      name: 'Flat (No Shadow)',
      icon: '📄',
      category: 'preset',
      values: {
        hue: 200,
        controlBarOpacity: 0.25,
        controlBarBlur: 30,
        controlBarBg: 'rgba(255, 255, 255, 0.12)',
        controlBarBorder: 'rgba(255, 255, 255, 0.2)',
        controlBarBorderRadius: 20,
        buttonBgOpacity: 0.12,
        buttonBorderOpacity: 0.2,
        buttonHoverBgOpacity: 0.25,
        textColor: 'rgba(255, 255, 255, 0.95)',
        progressGradient: 'linear-gradient(90deg, #50C9C3 0%, #96DEDA 100%)',
        progressShadow: 'rgba(80, 201, 195, 0.5)',
        panelSaturation: 120,
        panelContrast: 100,
        panelBrightness: 110,
        themeColorSaturation: 70,
        themeColorLightness: 60,
        shadowEnabled: false,
        backgroundEnabled: true,
        glowIntensity: 0.7,
        scale: 1,
        buttonSize: 52,
        buttonSpacing: 12,
        buttonSaturation: 105,
        squareButtons: false,
        buttonGlow: 0.4
      }
    },
    random: {
      name: 'Random',
      icon: '🎲',
      category: 'preset',
      values: { hue: 0 }
    },
    custom: {
      name: 'Custom',
      icon: '🎨',
      category: 'custom',
      values: {
        hue: 200,
        controlBarOpacity: 0.2,
        controlBarBlur: 50,
        controlBarBg: 'rgba(0, 0, 0, 0.2)',
        controlBarBorder: 'rgba(255, 255, 255, 0.2)',
        controlBarBorderRadius: 20,
        buttonBgOpacity: 0.15,
        buttonBorderOpacity: 0.25,
        buttonHoverBgOpacity: 0.3,
        textColor: 'rgba(255, 255, 255, 0.95)',
        progressGradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        progressShadow: 'rgba(102, 126, 234, 0.6)'
      }
    }
  };

  // RGB Gaming theme with animation
  let rgbHue = 0;
  let rgbAnimationId = null;

  // ========================================
  // THEMES SYSTEM
  // ========================================

  // ========================================
  // DOM ELEMENTS
  // ========================================
  const elements = {
    playerUI: document.getElementById('player-ui'),
    folderBtn: document.getElementById('folder-btn'),
    coverArt: document.getElementById('cover-art'),
  coverMenu: document.getElementById('cover-menu'),
    trackTitle: document.getElementById('track-title'),
    trackArtist: document.getElementById('track-artist'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    shuffleBtn: document.getElementById('shuffle-btn'),
      shuffleIcon: document.getElementById('shuffle-icon'),
    loopBtn: document.getElementById('loop-btn'),
      loopIcon: document.getElementById('loop-icon'),
    progressBar: document.getElementById('progress-bar'),
    progressFill: document.getElementById('progress-fill'),
    currentTime: document.getElementById('current-time'),
    totalTime: document.getElementById('total-time'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    volumeBtn: document.getElementById('volume-btn'),
    volumePanel: document.getElementById('volume-panel'),
    audioPlayer: document.getElementById('audio-player'),
    ambianceCanvas: document.getElementById('ambiance-canvas'),
    settingsBtn: document.getElementById('settings-btn'),
    playlistBtn: document.getElementById('playlist-btn'),
    playlistPanel: document.getElementById('playlist-panel'),
    playlistBody: document.getElementById('playlist-body'),
    closePlaylistBtn: document.getElementById('close-playlist-panel')
  };

  // ========================================
  // ITUNES API INTEGRATION
  // ========================================
  
  // ========================================
  // METADATA HANDLING
  // ========================================
  
  async function readID3Tags(file) {
    return new Promise((resolve) => {
      if (!window.jsmediatags) {
        console.warn('[MusicTab] jsmediatags not loaded');
        resolve(null);
        return;
      }
      
      window.jsmediatags.read(file, {
        onSuccess: (tag) => {
          const tags = tag.tags;
          console.log('[MusicTab] ID3 tags found:', tags);
          
          let artwork = null;
          if (tags.picture) {
            const { data, format } = tags.picture;
            const base64String = data.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            artwork = `data:${format};base64,${btoa(base64String)}`;
          }
          
          resolve({
            title: tags.title || null,
            artist: tags.artist || null,
            album: tags.album || null,
            artwork: artwork,
            year: tags.year || null
          });
        },
        onError: (error) => {
          // Some files may not have accessible tags; keep it quiet
          console.debug('[MusicTab] ID3 read error (ignored)', error);
          resolve(null);
        }
      });
    });
  }
  
  async function fetchItunesMetadata(artist, title) {
    try {
      const cleanArtist = artist.replace(/\s*\(.*?\)\s*/g, '').trim();
      const cleanTitle = title.replace(/\s*[\(\[].*?[\)\]]\s*/g, '').trim();
      
      const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
      const response = await fetch(
        `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const track = data.results[0];
        // Get high-res artwork (600x600)
        const artworkUrl = track.artworkUrl100?.replace('100x100', '600x600');
        
        return {
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          artwork: artworkUrl,
          releaseDate: track.releaseDate
        };
      }
      
      return null;
    } catch (error) {
      console.error('[MusicTab] iTunes API error:', error);
      return null;
    }
  }

  // ========================================
  // FILE HANDLING
  // ========================================
  
  // IndexedDB functions for storing directory handle
  async function saveDirectoryHandle(dirHandle) {
    try {
      const db = await openDB();
      const tx = db.transaction(['directories'], 'readwrite');
      const store = tx.objectStore('directories');
      await store.put(dirHandle, 'lastDirectory');
      console.log('[MusicTab] Directory handle saved');
    } catch (e) {
      console.error('[MusicTab] Error saving directory handle:', e);
    }
  }
  
  async function loadDirectoryHandle() {
    try {
      const db = await openDB();
      const tx = db.transaction(['directories'], 'readonly');
      const store = tx.objectStore('directories');
      
      return new Promise((resolve, reject) => {
        const request = store.get('lastDirectory');
        
        request.onsuccess = async () => {
          const dirHandle = request.result;
          
          if (dirHandle) {
            try {
              // Verify permission
              const permission = await dirHandle.queryPermission({ mode: 'read' });
              if (permission === 'granted') {
                resolve(dirHandle);
              } else {
                // Request permission again
                const newPermission = await dirHandle.requestPermission({ mode: 'read' });
                if (newPermission === 'granted') {
                  resolve(dirHandle);
                } else {
                  resolve(null);
                }
              }
            } catch (e) {
              console.error('[MusicTab] Permission error:', e);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          console.error('[MusicTab] Error getting directory handle:', request.error);
          resolve(null);
        };
      });
    } catch (e) {
      console.error('[MusicTab] Error loading directory handle:', e);
      return null;
    }
  }
  
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MusicTabDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('directories')) {
          db.createObjectStore('directories');
        }
      };
    });
  }
  
  async function loadFolderFromHandle(dirHandle) {
    try {
      const files = [];
      
      // Recursively read all MP3 files
      async function readDirectory(dirHandle) {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            if (file.name.toLowerCase().endsWith('.mp3')) {
              files.push(file);
            }
          } else if (entry.kind === 'directory') {
            await readDirectory(entry);
          }
        }
      }
      
      await readDirectory(dirHandle);
      
      if (files.length === 0) {
        console.log('[MusicTab] No MP3 files found in saved folder');
        return false;
      }
      
      // Build playlist (parse simple "Artist - Title.mp3" pattern when possible)
      playlist = files.map(file => {
        const base = file.name.replace(/\.mp3$/i, '');
        let artist = 'Unknown Artist';
        let title = extractTitle(file.name);
        const dashIdx = base.indexOf(' - ');
        if (dashIdx > 0) {
          const a = base.slice(0, dashIdx).trim();
          const t = base.slice(dashIdx + 3).trim();
          if (a && t) { artist = a; title = t; }
        }
        return {
          file,
          title,
          artist,
          url: URL.createObjectURL(file)
        };
      });
      
      // Sort by filename
      playlist.sort((a, b) => a.file.name.localeCompare(b.file.name));
      
      // Keep original order for shuffle
      originalPlaylist = [...playlist];
      
      console.log(`[MusicTab] Loaded ${files.length} MP3 files from saved folder`);

      // NOTE: Do NOT block on ID3 enrichment here. Start background enrichment
      // so UI updates immediately and playback can start right away.
      (async () => {
        try {
          for (let i = 0; i < playlist.length; i++) {
            const track = playlist[i];
            if (track && track.file) {
              const tags = await readID3Tags(track.file);
              if (tags) {
                if (tags.title) track.title = tags.title;
                if (tags.artist) track.artist = tags.artist;
              }
              // Update only this playlist item to avoid full rebuild flicker
              updatePlaylistItem(i);
            }
          }
        } catch (e) {
          console.warn('[MusicTab] ID3 enrichment error:', e);
        }
      })();
      
      // Load first track or saved track
      if (playlist.length > 0) {
        const savedIndex = currentTrackIndex || 0;
        const trackIndex = Math.min(savedIndex, playlist.length - 1);
        // Start loading the first track immediately (loadTrack will start playback quickly)
        await loadTrack(trackIndex);
        updatePlaylistUI();
        saveSettings();
        return true;
      }
    } catch (error) {
      console.error('[MusicTab] Error loading from saved folder:', error);
    }
    return false;
  }
  
  async function handleFolderSelection() {
    try {
      // Use File System Access API
      const dirHandle = await window.showDirectoryPicker({
        mode: 'read'
      });
      
      // Save directory handle for next time
      await saveDirectoryHandle(dirHandle);
      
      // Load files from directory
      await loadFolderFromHandle(dirHandle);
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[MusicTab] Error selecting folder:', error);
        alert('Error selecting folder. Please try again.');
      }
    }
  }

  function extractTitle(filename) {
    // Remove file extension and common prefixes
    let title = filename.replace(/\.mp3$/i, '');
    
    // Remove track numbers (01 - Title.mp3 -> Title)
    title = title.replace(/^\d+\s*[-_.\s]+/, '');
    
    // Replace underscores and dashes with spaces
    title = title.replace(/[_-]/g, ' ');
    
    return title.trim();
  }

  // ========================================
  // PLAYER LOGIC
  // ========================================
  
  function toggleShuffle() {
    isShuffleEnabled = !isShuffleEnabled;
    elements.shuffleBtn.classList.toggle('active', isShuffleEnabled);
    if (elements.shuffleIcon) elements.shuffleIcon.classList.toggle('active', isShuffleEnabled);
    
    if (isShuffleEnabled) {
      // Shuffle playlist
      const currentTrack = playlist[currentTrackIndex];
      playlist = [...originalPlaylist];
      
      // Fisher-Yates shuffle
      for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
      }
      
      // Find current track in shuffled playlist
      currentTrackIndex = playlist.findIndex(t => t.url === currentTrack.url);
    } else {
      // Restore original order
      const currentTrack = playlist[currentTrackIndex];
      playlist = [...originalPlaylist];
      currentTrackIndex = playlist.findIndex(t => t.url === currentTrack.url);
    }
    
    saveSettings();
    console.log(`[MusicTab] Shuffle ${isShuffleEnabled ? 'enabled' : 'disabled'}`);
    // Rebuild playlist UI after order change to reflect new ordering
    updatePlaylistUI(true);
  }
  
  function toggleLoop() {
    isLoopEnabled = !isLoopEnabled;
    elements.loopBtn.classList.toggle('active', isLoopEnabled);
    elements.audioPlayer.loop = isLoopEnabled;
    if (elements.loopIcon) elements.loopIcon.classList.toggle('active', isLoopEnabled);
    saveSettings();
    console.log(`[MusicTab] Loop ${isLoopEnabled ? 'enabled' : 'disabled'}`);
  }
  
  function showPlayer() {
    // Player is always shown now
  }

  async function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    // Save current track index
    saveSettings();
    
    // Stop current playback
    elements.audioPlayer.pause();
    isPlaying = false;
    
  // Show immediate file-derived info so UI doesn't wait on metadata
  elements.trackTitle.textContent = track.title || 'Loading...';
  elements.trackArtist.textContent = track.artist || '...';
    
    // Fade out cover
    elements.coverArt.style.opacity = '0';
    
    // Set audio source and start playback IMMEDIATELY to keep user gesture
    elements.audioPlayer.src = track.url;
    play();

    // Continue metadata work in background; only apply if this track is still current
    const myIndex = index;
    (async () => {
      // 1) Read ID3 tags (if available)
      let id3Metadata = null;
      if (track.file) {
        try { id3Metadata = await readID3Tags(track.file); } catch {}
      }

      // 2) Derive best-known title/artist from ID3 or existing parsed values
      let derivedTitle = track.title || '';
      let derivedArtist = track.artist || '';
      if (id3Metadata) {
        if (id3Metadata.title) derivedTitle = id3Metadata.title;
        if (id3Metadata.artist) derivedArtist = id3Metadata.artist;
      }

      // 3) Try iTunes metadata to get high-res artwork (and possibly better names)
      let itunesMetadata = null;
      if ((derivedArtist && derivedArtist.trim()) || (derivedTitle && derivedTitle.trim())) {
        try {
          itunesMetadata = await fetchItunesMetadata(derivedArtist || '', derivedTitle || '');
        } catch {}
      }

      if (currentTrackIndex !== myIndex) return; // user changed tracks

      // 4) Merge metadata preference: prefer names from ID3 when present; fallback to iTunes; finally original
      const finalTitle = (id3Metadata && id3Metadata.title) || (itunesMetadata && itunesMetadata.title) || track.title;
      const finalArtist = (id3Metadata && id3Metadata.artist) || (itunesMetadata && itunesMetadata.artist) || track.artist;
      const finalAlbum = (id3Metadata && id3Metadata.album) || (itunesMetadata && itunesMetadata.album) || track.album;
      const finalArtwork = (itunesMetadata && itunesMetadata.artwork) || (id3Metadata && id3Metadata.artwork) || null;

      track.title = finalTitle;
      track.artist = finalArtist;
      track.album = finalAlbum;

      // 5) Update cover prioritizing iTunes artwork; fallback to ID3; else default
      if (finalArtwork) {
        const img = new Image();
        img.onload = () => {
          setTimeout(() => {
            if (currentTrackIndex !== myIndex) return;
            elements.coverArt.src = finalArtwork;
            elements.coverArt.style.opacity = '1';
            applyCoverFilters();
            updateCoverBackground(finalArtwork);
          }, 100);
        };
        img.onerror = () => { if (currentTrackIndex === myIndex) setDefaultCover(); };
        img.src = finalArtwork;
      } else {
        setDefaultCover();
      }

      updatePlaylistUI();

      // 6) Update UI with latest names
      setTimeout(() => {
        if (currentTrackIndex !== myIndex) return;
        elements.trackTitle.textContent = track.title;
        elements.trackArtist.textContent = track.artist;
        if (currentTheme === 'random') {
          setTimeout(() => {
            if (currentTrackIndex !== myIndex) return;
            applyTheme('random');
          }, 300);
        }
      }, 100);
    })();
  }

  function setDefaultCover() {
    const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:%231a1a1a"/>
          <stop offset="100%" style="stop-color:%232d2d2d"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23g)"/>
      <g transform="translate(140, 140)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" opacity="0.4" width="120" height="120">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </g>
    </svg>`;
    
    // Fade in default cover
    setTimeout(() => {
      elements.coverArt.src = svg;
      elements.coverArt.style.opacity = '1';
      // Apply filters to cover
      applyCoverFilters();
      // Update background with default cover
      updateCoverBackground(svg);
    }, 100);
  }
  
  function updateCoverBackground(imageUrl) {
    const coverContainer = document.getElementById('cover-container');
    if (coverContainer) {
      coverContainer.style.setProperty('--cover-bg-image', `url("${imageUrl}")`);
    }
  }

  let resumeOnGestureHandler = null;
  function play() {
    const onPlayStarted = () => {
      isPlaying = true;
      elements.playPauseBtn.textContent = '⏸';
      // Initialize audio context on first successful play
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createMediaElementSource(elements.audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }
      if (ambianceEnabled) startAmbiance();
      startAudioReactiveBackground();
    };

    const attempt = elements.audioPlayer.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt.then(onPlayStarted).catch((err) => {
        if (err && (err.name === 'AbortError')) {
          console.debug('[MusicTab] play() interrupted (AbortError)');
          return;
        }
        // Autoplay policy or other DOMException: queue a user-gesture retry
        console.warn('[MusicTab] play() error:', err);
        isPlaying = false;
        elements.playPauseBtn.textContent = '▶';
        if (!resumeOnGestureHandler) {
          resumeOnGestureHandler = () => {
            document.removeEventListener('click', resumeOnGestureHandler, true);
            document.removeEventListener('keydown', resumeOnGestureHandler, true);
            resumeOnGestureHandler = null;
            play();
          };
          document.addEventListener('click', resumeOnGestureHandler, true);
          document.addEventListener('keydown', resumeOnGestureHandler, true);
        }
      });
    } else {
      // Older browsers returning void
      onPlayStarted();
    }
  }

  function pause() {
    elements.audioPlayer.pause();
    isPlaying = false;
    elements.playPauseBtn.textContent = '▶';
  }

  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function previousTrack() {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    loadTrack(newIndex);
    updatePlaylistUI();
  }

  function nextTrack() {
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    loadTrack(newIndex);
    updatePlaylistUI();
  }

  // ========================================
  // AMBIANCE EFFECT
  // ========================================
  
  function startAmbiance() {
    if (ambianceAnimationId) return;
    
    const canvas = elements.ambianceCanvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Set canvas size (larger for better quality)
    canvas.width = 600;
    canvas.height = 600;
    
    // Show canvas
    canvas.classList.add('active');
    
    // Audio analysis data
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let frameCount = 0;
    
    function renderAmbiance() {
      if (!isPlaying) {
        stopAmbiance();
        return;
      }
      
      // Skip frames for performance (30fps)
      frameCount++;
      if (frameCount % 2 !== 0) {
        ambianceAnimationId = requestAnimationFrame(renderAmbiance);
        return;
      }
      
      // Get audio intensity
      let audioIntensity = 0.5; // Default when no audio data
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        // Calculate overall intensity from frequency data
        const sum = dataArray.reduce((a, b) => a + b, 0);
        audioIntensity = Math.min(1, sum / (dataArray.length * 255));
      }
      
      // Clear canvas with alpha for accumulation effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.3 - audioIntensity * 0.15})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Sample color from cover art
      try {
        const img = elements.coverArt;
        if (img.complete && img.naturalWidth > 0) {
          // Draw cover art with audio-reactive size and opacity
          const scale = 1 + audioIntensity * 1.5;
          const w = canvas.width * scale;
          const h = canvas.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          
          ctx.globalAlpha = 0.4 + audioIntensity * 0.4;
          ctx.drawImage(img, x, y, w, h);
          ctx.globalAlpha = 1;
        }
      } catch (e) {
        // CORS error - fill with audio-reactive gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const hue = (frameCount * 0.5) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 40%)`);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3 + audioIntensity * 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
      
      ambianceAnimationId = requestAnimationFrame(renderAmbiance);
    }
    
    renderAmbiance();
  }

  function stopAmbiance() {
    if (ambianceAnimationId) {
      cancelAnimationFrame(ambianceAnimationId);
      ambianceAnimationId = null;
    }
    elements.ambianceCanvas.classList.remove('active');
  }

  // ========================================
  // AUDIO-REACTIVE BACKGROUND
  // ========================================
  
  let audioReactiveAnimationId = null;
  
  function startAudioReactiveBackground() {
    if (!analyser || audioReactiveAnimationId) return;
    
    const coverContainer = document.getElementById('cover-container');
    if (!coverContainer) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    function animate() {
      if (!isPlaying) {
        stopAudioReactiveBackground();
        return;
      }
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average frequency for bass, mid, and treble
      const bass = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10 / 255;
      const mid = dataArray.slice(10, 50).reduce((a, b) => a + b) / 40 / 255;
      const treble = dataArray.slice(50, 100).reduce((a, b) => a + b) / 50 / 255;
      
      // Map audio data to animation properties (stronger intensity)
      const scale = 1 + (bass * 0.8); // Stronger scale variation
      const opacity = 0.65 + (mid * 0.35); // More opacity variation
      const blur = 45 + (treble * 55); // Stronger blur variation (45-100px)
      
      // Apply to the ::before pseudo-element via CSS variables
      coverContainer.style.setProperty('--audio-scale', scale);
      coverContainer.style.setProperty('--audio-opacity', opacity);
      coverContainer.style.setProperty('--audio-blur', `${blur}px`);
      
      audioReactiveAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  function stopAudioReactiveBackground() {
    if (audioReactiveAnimationId) {
      cancelAnimationFrame(audioReactiveAnimationId);
      audioReactiveAnimationId = null;
    }
  }

  // ========================================
  // TIME FORMATTING
  // ========================================
  
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================
  
  // Folder Selection
  elements.folderBtn.addEventListener('click', handleFolderSelection);

  // Playback Controls
  elements.playPauseBtn.addEventListener('click', togglePlayPause);
  elements.prevBtn.addEventListener('click', previousTrack);
  elements.nextBtn.addEventListener('click', nextTrack);
  
  // Toggle Controls
  elements.shuffleBtn.addEventListener('click', toggleShuffle);
  elements.loopBtn.addEventListener('click', toggleLoop);
  if (elements.shuffleIcon) elements.shuffleIcon.addEventListener('click', toggleShuffle);
  if (elements.loopIcon) elements.loopIcon.addEventListener('click', toggleLoop);
  
  // Fullscreen feature and button removed per request

  // Audio Events
  elements.audioPlayer.addEventListener('timeupdate', () => {
    const current = elements.audioPlayer.currentTime;
    const duration = elements.audioPlayer.duration;
    
    if (duration) {
      const percent = (current / duration) * 100;
      elements.progressFill.style.width = `${percent}%`;
      elements.currentTime.textContent = formatTime(current);
      elements.totalTime.textContent = formatTime(duration);
    }
  });

  elements.audioPlayer.addEventListener('ended', () => {
    if (!isLoopEnabled) {
      nextTrack();
    }
  });

  elements.audioPlayer.addEventListener('loadedmetadata', () => {
    elements.totalTime.textContent = formatTime(elements.audioPlayer.duration);
  });

  // Progress Bar
  elements.progressBar.addEventListener('click', (e) => {
    const rect = elements.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    elements.audioPlayer.currentTime = elements.audioPlayer.duration * percent;
  });

  // Volume Control
  elements.volumeBtn.addEventListener('click', () => {
    elements.volumePanel.classList.toggle('hidden');
  });

  // Close volume panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!elements.volumeBtn.contains(e.target) && !elements.volumePanel.contains(e.target)) {
      elements.volumePanel.classList.add('hidden');
    }
  });

  elements.volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    elements.audioPlayer.volume = volume;
    elements.volumeValue.textContent = `${e.target.value}%`;
    saveSettings();
  });

  // Set initial volume
  elements.audioPlayer.volume = 0.7;

  // ========================================
  // THEME SYSTEM
  // ========================================
  
  function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    currentTheme = themeName;
    const values = theme.values;
    
    // Stop RGB animation if switching away
    if (rgbAnimationId && themeName !== 'rgbGaming') {
      cancelAnimationFrame(rgbAnimationId);
      rgbAnimationId = null;
    }
    
    // Special: Random theme generates a full random configuration across all parameters
    if (themeName === 'random') {
      const settings = generateRandomSettings();
      applyCustomTheme(settings);
      // Keep currentTheme as 'random' so it can randomize again on track change if desired
      saveSettings();
      console.log('[MusicTab] Random theme generated');
      return;
    }
    
  // Apply CSS variables
    document.documentElement.style.setProperty('--control-bar-bg', values.controlBarBg);
    document.documentElement.style.setProperty('--control-bar-border', values.controlBarBorder);
    document.documentElement.style.setProperty('--control-bar-blur', `${values.controlBarBlur}px`);
    document.documentElement.style.setProperty('--control-bar-opacity', values.controlBarOpacity);
    document.documentElement.style.setProperty('--control-bar-radius', `${values.controlBarBorderRadius}px`);
    document.documentElement.style.setProperty('--button-bg-opacity', values.buttonBgOpacity);
    document.documentElement.style.setProperty('--button-border-opacity', values.buttonBorderOpacity);
    document.documentElement.style.setProperty('--button-hover-bg-opacity', values.buttonHoverBgOpacity);
    document.documentElement.style.setProperty('--text-color', values.textColor);
    document.documentElement.style.setProperty('--progress-gradient', values.progressGradient);
    document.documentElement.style.setProperty('--progress-shadow', values.progressShadow);
    document.documentElement.style.setProperty('--theme-hue', values.hue);
    document.documentElement.style.setProperty('--glow-intensity', values.glowIntensity || 1);
    
    // Apply panel filters to all panels (control-bar, playlist, theme-panel)
    const blur = values.controlBarBlur || 60;
    const panelSaturation = values.panelSaturation || 180;
    const panelContrast = values.panelContrast || 100;
    const panelBrightness = values.panelBrightness || 100;
    const shadowEnabled = values.shadowEnabled !== undefined ? values.shadowEnabled : true;
    const backgroundEnabled = values.backgroundEnabled !== undefined ? values.backgroundEnabled : true;
    
    // Apply to control bar (including background/border toggles)
    const controlsElement = document.getElementById('controls');
    if (controlsElement) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      controlsElement.style.backdropFilter = backgroundEnabled ? filterValue : 'none';
      controlsElement.style.webkitBackdropFilter = backgroundEnabled ? filterValue : 'none';
      // Background/border
      controlsElement.style.background = backgroundEnabled ? (values.controlBarBg || 'rgba(0,0,0,0.18)') : 'transparent';
      controlsElement.style.border = backgroundEnabled ? `1px solid ${values.controlBarBorder || 'rgba(255,255,255,0.08)'}` : 'none';
      
      if (shadowEnabled) {
        controlsElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
      } else {
        controlsElement.style.boxShadow = 'none';
      }
    }
    
  // Apply to playlist
    const playlistContent = document.querySelector('.playlist-content');
    if (playlistContent) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      playlistContent.style.backdropFilter = filterValue;
      playlistContent.style.webkitBackdropFilter = filterValue;
      
      if (backgroundEnabled) {
        playlistContent.style.background = values.controlBarBg || 'rgba(0,0,0,0.18)';
        playlistContent.style.border = `1px solid ${values.controlBarBorder || 'rgba(255,255,255,0.08)'}`;
      } else {
        playlistContent.style.background = 'transparent';
        playlistContent.style.border = 'none';
      }

      if (shadowEnabled) {
        playlistContent.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
      } else {
        playlistContent.style.boxShadow = 'none';
      }
    }
    
  // Apply to theme panel (filters + bg + border + shadow)
    const themePanelContent = document.querySelector('.theme-panel-content');
    // Apply to cover context menu
    if (elements.coverMenu) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      elements.coverMenu.style.backdropFilter = filterValue;
      elements.coverMenu.style.webkitBackdropFilter = filterValue;
      elements.coverMenu.style.background = backgroundEnabled ? (values.controlBarBg || 'rgba(0,0,0,0.18)') : 'transparent';
      elements.coverMenu.style.border = backgroundEnabled ? `1px solid ${values.controlBarBorder || 'rgba(255,255,255,0.08)'}` : 'none';
      elements.coverMenu.style.boxShadow = '0 18px 50px rgba(0,0,0,0.45)';
    }
    if (themePanelContent) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      themePanelContent.style.backdropFilter = filterValue;
      themePanelContent.style.webkitBackdropFilter = filterValue;
      themePanelContent.style.background = backgroundEnabled ? (values.controlBarBg || 'rgba(0,0,0,0.18)') : 'transparent';
      themePanelContent.style.border = backgroundEnabled ? `1px solid ${values.controlBarBorder || 'rgba(255,255,255,0.08)'}` : 'none';

      if (shadowEnabled) {
        themePanelContent.style.boxShadow = '-4px 0 40px rgba(0, 0, 0, 0.5)';
      } else {
        themePanelContent.style.boxShadow = 'none';
      }
    }

    // Apply control layout (scale, sizes, spacing, saturation, shape)
    const scaleVal = values.scale !== undefined ? values.scale : 1;
    const buttonSize = values.buttonSize !== undefined ? values.buttonSize : 52;
    const buttonSpacing = values.buttonSpacing !== undefined ? values.buttonSpacing : 14;
    const buttonSaturation = values.buttonSaturation !== undefined ? values.buttonSaturation : 100;
    const squareButtons = values.squareButtons !== undefined ? values.squareButtons : false;
    const buttonGlow = values.buttonGlow !== undefined ? values.buttonGlow : 0.3;

    document.documentElement.style.setProperty('--button-glow-opacity', buttonGlow);
    if (controlsElement) {
      controlsElement.style.transform = `translateX(-50%) scale(${scaleVal})`;
      const responsivePadding = Math.max(18, Math.round(buttonSize * 0.35));
      controlsElement.style.padding = `${responsivePadding}px ${responsivePadding + 4}px`;
      controlsElement.style.gap = `${buttonSpacing}px`;
      controlsElement.style.minHeight = `${buttonSize + responsivePadding * 2}px`;
      // Scale external toggle icons proportionally
      controlsElement.style.setProperty('--toggle-icon-size', `${Math.round(buttonSize * 0.6)}px`);
    }

    const controlButtons = document.querySelectorAll('.control-btn');
    const squareBtnRadius = squareButtons ? '12px' : '50%';
    controlButtons.forEach(btn => {
      if (!btn.id.includes('play-pause')) {
        btn.style.width = `${buttonSize}px`;
        btn.style.height = `${buttonSize}px`;
        btn.style.borderRadius = squareBtnRadius;
        btn.style.filter = `saturate(${buttonSaturation}%)`;
      }
    });

    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const squareToggleRadius = squareButtons ? '10px' : '50%';
    toggleButtons.forEach(btn => {
      if (btn.classList.contains('ios-switch')) {
        // iOS switches have their own sizing
        btn.style.width = '54px';
        btn.style.height = '30px';
        btn.style.borderRadius = '999px';
      } else {
        btn.style.width = `${Math.round(buttonSize * 0.83)}px`;
        btn.style.height = `${Math.round(buttonSize * 0.83)}px`;
        btn.style.borderRadius = squareToggleRadius;
      }
      btn.style.filter = `saturate(${buttonSaturation}%)`;
    });

    const playBtn = document.getElementById('play-pause-btn');
    const squarePlayRadius = squareButtons ? '16px' : '50%';
    if (playBtn) {
      playBtn.style.width = `${Math.round(buttonSize * 1.33)}px`;
      playBtn.style.height = `${Math.round(buttonSize * 1.33)}px`;
      playBtn.style.borderRadius = squarePlayRadius;
      playBtn.style.filter = `saturate(${buttonSaturation}%)`;
    }

    const folderBtn = document.getElementById('folder-btn');
    if (folderBtn) {
      folderBtn.style.borderRadius = squareBtnRadius;
      folderBtn.style.filter = `saturate(${buttonSaturation}%)`;
    }
    
    // Special: RGB Gaming theme
    if (themeName === 'rgbGaming') {
      startRGBAnimation();
    }
    
    saveSettings();
    console.log(`[MusicTab] Theme applied: ${theme.name}`);
  }
  
  function extractColorsFromCover() {
    const coverArt = document.getElementById('cover-art');
    if (!coverArt || !coverArt.src || coverArt.src.includes('data:')) {
      console.log('[MusicTab] No cover image to extract colors from');
      return;
    }
    
    // Try to use already loaded image first
    if (coverArt.complete && coverArt.naturalWidth > 0) {
      processImageForColors(coverArt);
    } else {
      // Wait for image to load
      const img = new Image();
      
      img.onload = () => {
        processImageForColors(img);
      };
      
      img.onerror = () => {
        console.error('[MusicTab] Failed to load cover image for color extraction');
      };
      
      // Try without CORS first (for local/cached images)
      img.src = coverArt.src;
    }
  }
  
  function processImageForColors(img) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < pixels.length; i += 40) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      // Convert RGB to HSL to get hue
      const hsl = rgbToHsl(r, g, b);
      const hue = Math.floor(hsl[0]);
      
      // Create colors based on extracted hue
      const bgColor = `hsla(${hue}, 50%, 20%, 0.25)`;
      const borderColor = `hsla(${hue}, 70%, 50%, 0.3)`;
      const progressGradient = `linear-gradient(90deg, hsl(${hue}, 80%, 50%) 0%, hsl(${(hue + 30) % 360}, 80%, 55%) 50%, hsl(${(hue + 60) % 360}, 80%, 60%) 100%)`;
      const progressShadow = `hsla(${hue}, 80%, 50%, 0.6)`;
      
      // Apply colors
      document.documentElement.style.setProperty('--control-bar-bg', bgColor);
      document.documentElement.style.setProperty('--control-bar-border', borderColor);
      document.documentElement.style.setProperty('--control-bar-blur', '60px');
      document.documentElement.style.setProperty('--control-bar-opacity', 0.25);
      document.documentElement.style.setProperty('--control-bar-radius', '24px');
      document.documentElement.style.setProperty('--button-bg-opacity', 0.15);
      document.documentElement.style.setProperty('--button-border-opacity', 0.25);
      document.documentElement.style.setProperty('--button-hover-bg-opacity', 0.3);
      document.documentElement.style.setProperty('--text-color', 'rgba(255, 255, 255, 0.95)');
      document.documentElement.style.setProperty('--progress-gradient', progressGradient);
      document.documentElement.style.setProperty('--progress-shadow', progressShadow);
      document.documentElement.style.setProperty('--theme-hue', hue);
      
      console.log(`[MusicTab] Auto theme applied with hue: ${hue}° from cover`);
      saveSettings();
    } catch (error) {
      console.error('[MusicTab] Error processing image for colors:', error);
    }
  }
  
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return [h * 360, s * 100, l * 100];
  }
  
  function applyCustomTheme(settings) {
    customThemeSettings = settings;
    
    const hue = settings.hue || 200;
    const themeColorSaturation = settings.themeColorSaturation || 50;
    const themeColorLightness = settings.themeColorLightness || 50;
    const opacity = settings.opacity || 0.2;
    const blur = settings.blur || 50;
    const borderRadius = settings.borderRadius || 20;
    const borderOpacity = settings.borderOpacity || 0.2;
    const panelSaturation = settings.panelSaturation || 180;
    const panelContrast = settings.panelContrast || 100;
    const panelBrightness = settings.panelBrightness || 100;
    const scale = settings.scale || 1;
  const padding = settings.padding !== undefined ? settings.padding : 20;
    const buttonSize = settings.buttonSize || 52;
    const buttonSpacing = settings.buttonSpacing || 14;
    const buttonGlow = settings.buttonGlow !== undefined ? settings.buttonGlow : 0.3;
    const buttonSaturation = settings.buttonSaturation || 100;
    const glowIntensity = settings.glowIntensity !== undefined ? settings.glowIntensity : 1;
    const backgroundEnabled = settings.backgroundEnabled !== undefined ? settings.backgroundEnabled : true;
    const shadowEnabled = settings.shadowEnabled !== undefined ? settings.shadowEnabled : true;
    const squareButtons = settings.squareButtons !== undefined ? settings.squareButtons : false;
    
    // Store panel filters for later use
    customThemeSettings.panelSaturation = panelSaturation;
    customThemeSettings.panelContrast = panelContrast;
    customThemeSettings.panelBrightness = panelBrightness;
    
    // Generate colors with adjustable saturation and lightness
    const bgColor = `hsla(${hue}, ${themeColorSaturation}%, ${Math.max(10, themeColorLightness - 30)}%, ${opacity})`;
    const borderColor = `hsla(${hue}, ${Math.min(100, themeColorSaturation + 20)}%, ${Math.min(70, themeColorLightness + 10)}%, ${borderOpacity})`;
    const progressGradient = `linear-gradient(90deg, hsl(${hue}, ${Math.min(100, themeColorSaturation + 30)}%, ${themeColorLightness}%) 0%, hsl(${(hue + 30) % 360}, ${Math.min(100, themeColorSaturation + 30)}%, ${Math.min(70, themeColorLightness + 5)}%) 50%, hsl(${(hue + 60) % 360}, ${Math.min(100, themeColorSaturation + 30)}%, ${Math.min(80, themeColorLightness + 10)}%) 100%)`;
    const progressShadow = `hsla(${hue}, ${Math.min(100, themeColorSaturation + 30)}%, ${themeColorLightness}%, 0.6)`;
    
    // Always set theme variables with real values (for menu and playlist)
    document.documentElement.style.setProperty('--control-bar-bg', bgColor);
    document.documentElement.style.setProperty('--control-bar-border', borderColor);
    document.documentElement.style.setProperty('--control-bar-blur', `${blur}px`);
    document.documentElement.style.setProperty('--control-bar-opacity', opacity);
    document.documentElement.style.setProperty('--control-bar-radius', `${borderRadius}px`);
    document.documentElement.style.setProperty('--button-bg-opacity', 0.15);
    document.documentElement.style.setProperty('--button-border-opacity', 0.25);
    document.documentElement.style.setProperty('--button-hover-bg-opacity', 0.3);
    document.documentElement.style.setProperty('--text-color', 'rgba(255, 255, 255, 0.95)');
    document.documentElement.style.setProperty('--progress-gradient', progressGradient);
    document.documentElement.style.setProperty('--progress-shadow', progressShadow);
    document.documentElement.style.setProperty('--glow-intensity', glowIntensity);
    document.documentElement.style.setProperty('--button-glow-opacity', buttonGlow);
    document.documentElement.style.setProperty('--theme-hue', hue);
    
    // Apply control bar layout
    const controlsElement = document.getElementById('controls');
    if (controlsElement) {
      controlsElement.style.transform = `translateX(-50%) scale(${scale})`;
      // Use user padding slider, enforce a small minimum
      const pad = Math.max(10, Math.round(padding));
      controlsElement.style.padding = `${pad}px ${pad + 4}px`;
      controlsElement.style.gap = `${buttonSpacing}px`;
      // Set min-height based on button size and chosen padding
      controlsElement.style.minHeight = `${buttonSize + pad * 2}px`;
      // Scale external toggle icons proportionally
      controlsElement.style.setProperty('--toggle-icon-size', `${Math.round(buttonSize * 0.6)}px`);
      
      // Apply background enabled/disabled with panel filters
      if (backgroundEnabled) {
        controlsElement.style.backdropFilter = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
        controlsElement.style.webkitBackdropFilter = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
        controlsElement.style.background = bgColor;
        controlsElement.style.border = `1px solid ${borderColor}`;
      } else {
        controlsElement.style.backdropFilter = 'none';
        controlsElement.style.webkitBackdropFilter = 'none';
        controlsElement.style.background = 'transparent';
        controlsElement.style.border = 'none';
      }
      
      // Set shadow
      if (shadowEnabled) {
        controlsElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
      } else {
        controlsElement.style.boxShadow = 'none';
      }
    }
    
  // Apply panel filters to playlist (independent from control bar toggles)
    const playlistContent = document.querySelector('.playlist-content');
    if (playlistContent) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      playlistContent.style.backdropFilter = filterValue;
      playlistContent.style.webkitBackdropFilter = filterValue;
      // Always use themed background and border for panels; toggles are for control bar only
      playlistContent.style.background = bgColor;
      playlistContent.style.border = `1px solid ${borderColor}`;
      playlistContent.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
    }
    
  // Apply panel filters to theme panel (independent from control bar toggles)
    const themePanelContent = document.querySelector('.theme-panel-content');
    // Apply style to cover context menu to follow theme
    if (elements.coverMenu) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      elements.coverMenu.style.backdropFilter = filterValue;
      elements.coverMenu.style.webkitBackdropFilter = filterValue;
      elements.coverMenu.style.background = bgColor;
      elements.coverMenu.style.border = `1px solid ${borderColor}`;
      elements.coverMenu.style.boxShadow = '0 18px 50px rgba(0,0,0,0.45)';
    }
    if (themePanelContent) {
      const filterValue = `blur(${blur}px) saturate(${panelSaturation}%) contrast(${panelContrast}%) brightness(${panelBrightness}%)`;
      themePanelContent.style.backdropFilter = filterValue;
      themePanelContent.style.webkitBackdropFilter = filterValue;
      // Always use themed background and border for panels; toggles are for control bar only
      themePanelContent.style.background = bgColor;
      themePanelContent.style.border = `1px solid ${borderColor}`;
      themePanelContent.style.boxShadow = '-4px 0 40px rgba(0, 0, 0, 0.5)';
    }
    
    const controlButtons = document.querySelectorAll('.control-btn');
    const squareBtnRadius = squareButtons ? '12px' : '50%';
    controlButtons.forEach(btn => {
      if (!btn.id.includes('play-pause')) {
        btn.style.width = `${buttonSize}px`;
        btn.style.height = `${buttonSize}px`;
        btn.style.borderRadius = squareBtnRadius;
        // Apply color saturation filter to buttons
        btn.style.filter = `saturate(${buttonSaturation}%)`;
      }
    });
    
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const squareToggleRadius = squareButtons ? '10px' : '50%';
    toggleButtons.forEach(btn => {
      if (btn.classList.contains('ios-switch')) {
        btn.style.width = '54px';
        btn.style.height = '30px';
        btn.style.borderRadius = '999px';
      } else {
        btn.style.width = `${Math.round(buttonSize * 0.83)}px`;
        btn.style.height = `${Math.round(buttonSize * 0.83)}px`;
        btn.style.borderRadius = squareToggleRadius;
      }
      // Apply color saturation filter to toggle buttons
      btn.style.filter = `saturate(${buttonSaturation}%)`;
    });
    
    const playBtn = document.getElementById('play-pause-btn');
    const squarePlayRadius = squareButtons ? '16px' : '50%';
    if (playBtn) {
      playBtn.style.width = `${Math.round(buttonSize * 1.33)}px`;
      playBtn.style.height = `${Math.round(buttonSize * 1.33)}px`;
      playBtn.style.borderRadius = squarePlayRadius;
      // Apply color saturation filter to play button
      playBtn.style.filter = `saturate(${buttonSaturation}%)`;
    }
    
    const folderBtn = document.getElementById('folder-btn');
    if (folderBtn) {
      folderBtn.style.borderRadius = squareBtnRadius;
      // Apply color saturation filter to folder button
      folderBtn.style.filter = `saturate(${buttonSaturation}%)`;
    }

    // Do not couple cover art shadow to control bar shadow toggle
    
    saveSettings();
    console.log('[MusicTab] Custom theme applied:', settings);
  }
  
  function applyCoverFilters() {
    const coverArt = document.getElementById('cover-art');
    if (coverArt) {
      // Only apply drop shadow to cover
      coverArt.style.filter = 'none';
      coverArt.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.4)';
    }
  }
  
  function startRGBAnimation() {
    function animate() {
      rgbHue = (rgbHue + 0.5) % 360;  // Réduit de 2 à 0.5 pour ralentir
      
      const bgColor = `hsla(${rgbHue}, 70%, 30%, 0.3)`;
      const borderColor = `hsla(${rgbHue}, 100%, 50%, 0.6)`;
      const progressGradient = `linear-gradient(90deg, hsl(${rgbHue}, 100%, 50%) 0%, hsl(${(rgbHue + 60) % 360}, 100%, 55%) 50%, hsl(${(rgbHue + 120) % 360}, 100%, 60%) 100%)`;
      const progressShadow = `hsla(${rgbHue}, 100%, 50%, 0.8)`;
      
      document.documentElement.style.setProperty('--control-bar-bg', bgColor);
      document.documentElement.style.setProperty('--control-bar-border', borderColor);
      document.documentElement.style.setProperty('--progress-gradient', progressGradient);
      document.documentElement.style.setProperty('--progress-shadow', progressShadow);
      document.documentElement.style.setProperty('--theme-hue', rgbHue);
      
      rgbAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  function rand(min, max, step = 1) {
    const n = Math.floor((Math.random() * (max - min + step)) / step) * step + min;
    return Math.max(min, Math.min(max, n));
  }
  function randFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function generateRandomSettings() {
    const hue = rand(0, 359);
    const themeColorSaturation = rand(40, 100);
    const themeColorLightness = rand(35, 75);
    const opacity = randFloat(0.08, 0.4);
    const blur = rand(10, 120);
    const borderRadius = rand(6, 34);
    const borderOpacity = randFloat(0.0, 0.6);
    const panelSaturation = rand(80, 260);
    const panelContrast = rand(90, 140);
    const panelBrightness = rand(85, 130);
    const scale = randFloat(0.85, 1.1);
    const padding = rand(10, 32);
    const buttonSize = rand(44, 60);
    const buttonSpacing = rand(10, 22);
    const buttonGlow = randFloat(0.0, 1.0);
    const buttonSaturation = rand(80, 160);
    const glowIntensity = randFloat(0.3, 1.6);
    const backgroundEnabled = Math.random() < 0.5 ? false : true;
    const shadowEnabled = Math.random() < 0.5 ? false : true;
    const squareButtons = Math.random() < 0.4 ? true : false;
    return {
      hue,
      themeColorSaturation,
      themeColorLightness,
      opacity,
      blur,
      borderRadius,
      borderOpacity,
      panelSaturation,
      panelContrast,
      panelBrightness,
      scale,
      padding,
      buttonSize,
      buttonSpacing,
      buttonGlow,
      buttonSaturation,
      glowIntensity,
      backgroundEnabled,
      shadowEnabled,
      squareButtons
    };
  }
  
  // Theme Panel UI
  function createThemePanel() {
    // Check if panel already exists
    let existingPanel = document.getElementById('theme-panel');
    if (existingPanel) {
      return; // Don't recreate if it already exists
    }
    
    const panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.className = 'theme-panel hidden';
    
    panel.innerHTML = `
      <div class="theme-panel-content">
        <div class="theme-panel-header">
          <h3>🎨 Themes & Settings</h3>
          <button id="close-theme-panel" class="close-btn">✕</button>
        </div>
        
        <div class="theme-panel-body">
          <div class="theme-tabs">
            <button class="theme-tab active" data-tab="presets">Presets</button>
            <button class="theme-tab" data-tab="custom">Custom</button>
          </div>
          
          <div class="theme-tab-content active" data-content="presets">
            <div class="theme-grid" id="preset-themes"></div>
          </div>
          
          <div class="theme-tab-content" data-content="custom">
            <div class="custom-controls">
              <h4 style="color: var(--text-color); margin-bottom: 12px; font-size: 14px;">🎨 Theme Colors</h4>
              
              <div class="control-group">
                <label>Hue (Color)</label>
                <input type="range" id="custom-hue" min="0" max="360" value="200">
                <span id="custom-hue-value">200°</span>
              </div>
              
              <div class="control-group">
                <label>Color Saturation</label>
                <input type="range" id="theme-color-saturation" min="1" max="100" value="50">
                <span id="theme-color-saturation-value">50%</span>
              </div>
              
              <div class="control-group">
                <label>Color Lightness</label>
                <input type="range" id="theme-color-lightness" min="1" max="100" value="50">
                <span id="theme-color-lightness-value">50%</span>
              </div>
              
              <div class="control-group">
                <label>Opacity</label>
                <input type="range" id="custom-opacity" min="1" max="100" value="20">
                <span id="custom-opacity-value">20%</span>
              </div>
              
              <div class="control-group">
                <label>Blur</label>
                <input type="range" id="custom-blur" min="1" max="150" value="50">
                <span id="custom-blur-value">50px</span>
              </div>
              
              <div class="control-group">
                <label>Border Radius</label>
                <input type="range" id="custom-radius" min="1" max="50" value="20">
                <span id="custom-radius-value">20px</span>
              </div>
              
              <div class="control-group">
                <label>Border Opacity</label>
                <input type="range" id="custom-border-opacity" min="0" max="100" value="20">
                <span id="custom-border-opacity-value">20%</span>
              </div>
              
              <h4 style="color: var(--text-color); margin: 20px 0 12px 0; font-size: 14px;">🎭 Panel Filters</h4>
              
              <div class="control-group">
                <label>Saturation</label>
                <input type="range" id="panel-saturation" min="1" max="300" value="180">
                <span id="panel-saturation-value">180%</span>
              </div>
              
              <div class="control-group">
                <label>Contrast</label>
                <input type="range" id="panel-contrast" min="1" max="200" value="100">
                <span id="panel-contrast-value">100%</span>
              </div>
              
              <div class="control-group">
                <label>Brightness</label>
                <input type="range" id="panel-brightness" min="1" max="200" value="100">
                <span id="panel-brightness-value">100%</span>
              </div>
              
              <h4 style="color: var(--text-color); margin: 20px 0 12px 0; font-size: 14px;">️ Control Bar Layout</h4>
              
              <div class="control-group">
                <label>Size Total</label>
                <input type="range" id="custom-scale" min="70" max="100" value="100">
                <span id="custom-scale-value">100%</span>
              </div>
              
              <div class="control-group">
                <label>Padding</label>
                <input type="range" id="custom-padding" min="10" max="40" value="20">
                <span id="custom-padding-value">20px</span>
              </div>
              
              <div class="control-group">
                <label>Button Size</label>
                <input type="range" id="custom-button-size" min="40" max="65" value="52">
                <span id="custom-button-size-value">52px</span>
              </div>
              
              <div class="control-group">
                <label>Button Spacing</label>
                <input type="range" id="custom-button-spacing" min="8" max="30" value="14">
                <span id="custom-button-spacing-value">14px</span>
              </div>
              
              <h4 style="color: var(--text-color); margin: 20px 0 12px 0; font-size: 14px;">🎨 Button Customization</h4>
              
              <div class="control-group">
                <label>Button Glow</label>
                <input type="range" id="custom-button-glow" min="0" max="100" value="60">
                <span id="custom-button-glow-value">60%</span>
              </div>
              
              <div class="control-group">
                <label>Button Color Saturation</label>
                <input type="range" id="custom-button-saturation" min="50" max="300" value="100">
                <span id="custom-button-saturation-value">100%</span>
              </div>
              
              <div class="control-group" style="display: flex; align-items: center; justify-content: space-between;">
                <div class="toggle-group">
                  <span id="icon-square-toggle" class="toggle-label-icon" title="Square Buttons">▣</span>
                  <label style="margin: 0;">Square Buttons</label>
                </div>
                <button class="toggle-btn ios-switch" id="custom-square-buttons-toggle" aria-label="Square Buttons"></button>
              </div>
              
              <h4 style="color: var(--text-color); margin: 20px 0 12px 0; font-size: 14px;">✨ Effects</h4>
              
              <div class="control-group">
                <label>Progress Glow</label>
                <input type="range" id="custom-glow-intensity" min="0" max="200" value="100">
                <span id="custom-glow-intensity-value">100%</span>
              </div>
              
              <div class="control-group" style="display: flex; align-items: center; justify-content: space-between;">
                <div class="toggle-group">
                  <span id="icon-background-toggle" class="toggle-label-icon" title="Hide Control Bar">⬚</span>
                  <label style="margin: 0;">Hide Control Bar</label>
                </div>
                <button class="toggle-btn ios-switch" id="custom-background-toggle" aria-label="Hide Control Bar"></button>
              </div>
              
              <div class="control-group" style="display: flex; align-items: center; justify-content: space-between;">
                <div class="toggle-group">
                  <span id="icon-shadow-toggle" class="toggle-label-icon" title="Hide Shadow">◐</span>
                  <label style="margin: 0;">Hide Shadow</label>
                </div>
                <button class="toggle-btn ios-switch" id="custom-shadow-toggle" aria-label="Hide Shadow"></button>
              </div>
              
              <button id="apply-custom-theme" class="apply-btn">Apply Custom Theme</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Populate preset themes
    const presetGrid = panel.querySelector('#preset-themes');
    Object.entries(THEMES).forEach(([key, theme]) => {
      if (theme.category === 'preset') {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.dataset.theme = key;
        card.innerHTML = `
          <div class="theme-icon">${theme.icon}</div>
          <div class="theme-name">${theme.name}</div>
        `;
        card.addEventListener('click', () => {
          applyTheme(key);
          document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        });
        presetGrid.appendChild(card);
      }
    });
    
    // Add RGB Gaming special theme
    const rgbCard = document.createElement('div');
    rgbCard.className = 'theme-card theme-card-rgb';
    rgbCard.dataset.theme = 'rgbGaming';
    rgbCard.innerHTML = `
      <div class="theme-icon">🎮</div>
      <div class="theme-name">RGB Gaming</div>
    `;
    rgbCard.addEventListener('click', () => {
      // Create RGB theme on the fly
      THEMES.rgbGaming = {
        name: 'RGB Gaming',
        icon: '🎮',
        category: 'preset',
        values: THEMES.neon.values // Start with neon values
      };
      applyTheme('rgbGaming');
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      rgbCard.classList.add('active');
    });
    presetGrid.appendChild(rgbCard);
    
    // Tab switching
    panel.querySelectorAll('.theme-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        panel.querySelectorAll('.theme-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.theme-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        panel.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
      });
    });
    
    // Custom theme controls
    const customHue = panel.querySelector('#custom-hue');
    const themeColorSaturation = panel.querySelector('#theme-color-saturation');
    const themeColorLightness = panel.querySelector('#theme-color-lightness');
    const customOpacity = panel.querySelector('#custom-opacity');
    const customBlur = panel.querySelector('#custom-blur');
    const customRadius = panel.querySelector('#custom-radius');
    const customBorderOpacity = panel.querySelector('#custom-border-opacity');
    const panelSaturation = panel.querySelector('#panel-saturation');
    const panelContrast = panel.querySelector('#panel-contrast');
    const panelBrightness = panel.querySelector('#panel-brightness');
    const customScale = panel.querySelector('#custom-scale');
    const customPadding = panel.querySelector('#custom-padding');
    const customButtonSize = panel.querySelector('#custom-button-size');
    const customButtonSpacing = panel.querySelector('#custom-button-spacing');
    const customButtonGlow = panel.querySelector('#custom-button-glow');
    const customButtonSaturation = panel.querySelector('#custom-button-saturation');
    const customGlowIntensity = panel.querySelector('#custom-glow-intensity');
  const customBackgroundToggle = panel.querySelector('#custom-background-toggle');
  const customShadowToggle = panel.querySelector('#custom-shadow-toggle');
  const customSquareButtonsToggle = panel.querySelector('#custom-square-buttons-toggle');
    // Icons for menu toggles
    const iconSquare = panel.querySelector('#icon-square-toggle');
    const iconBackground = panel.querySelector('#icon-background-toggle');
    const iconShadow = panel.querySelector('#icon-shadow-toggle');

    // Initialize states from current custom theme settings when available
    try {
      const bgEnabled = (customThemeSettings && typeof customThemeSettings.backgroundEnabled === 'boolean') ? customThemeSettings.backgroundEnabled : true;
      const shEnabled = (customThemeSettings && typeof customThemeSettings.shadowEnabled === 'boolean') ? customThemeSettings.shadowEnabled : true;
      const sqButtons = (customThemeSettings && typeof customThemeSettings.squareButtons === 'boolean') ? customThemeSettings.squareButtons : false;
      if (customBackgroundToggle) customBackgroundToggle.classList.toggle('active', !bgEnabled);
      if (customShadowToggle) customShadowToggle.classList.toggle('active', !shEnabled);
      if (customSquareButtonsToggle) customSquareButtonsToggle.classList.toggle('active', !!sqButtons);
    } catch (_) {}

    const isActive = (btn) => !!(btn && btn.classList.contains('active'));
    const syncMenuToggleIcons = () => {
      if (iconSquare) iconSquare.classList.toggle('active', isActive(customSquareButtonsToggle));
      if (iconBackground) iconBackground.classList.toggle('active', isActive(customBackgroundToggle));
      if (iconShadow) iconShadow.classList.toggle('active', isActive(customShadowToggle));
    };
    
    const applyRealTime = () => {
      const settings = {
        hue: parseInt(customHue.value),
        themeColorSaturation: parseInt(themeColorSaturation.value),
        themeColorLightness: parseInt(themeColorLightness.value),
        opacity: parseInt(customOpacity.value) / 100,
        blur: parseInt(customBlur.value),
        borderRadius: parseInt(customRadius.value),
        borderOpacity: parseInt(customBorderOpacity.value) / 100,
        panelSaturation: parseInt(panelSaturation.value),
        panelContrast: parseInt(panelContrast.value),
        panelBrightness: parseInt(panelBrightness.value),
        scale: parseInt(customScale.value) / 100,
        padding: parseInt(customPadding.value),
        buttonSize: parseInt(customButtonSize.value),
        buttonSpacing: parseInt(customButtonSpacing.value),
        buttonGlow: parseInt(customButtonGlow.value) / 100,
        buttonSaturation: parseInt(customButtonSaturation.value),
        glowIntensity: parseInt(customGlowIntensity.value) / 100,
        backgroundEnabled: !isActive(customBackgroundToggle),
        shadowEnabled: !isActive(customShadowToggle),
        squareButtons: isActive(customSquareButtonsToggle)
      };
      applyCustomTheme(settings);
    };
    
    customHue.addEventListener('input', (e) => {
      panel.querySelector('#custom-hue-value').textContent = `${e.target.value}°`;
      applyRealTime();
    });
    customHue.addEventListener('dblclick', () => {
      customHue.value = 200;
      panel.querySelector('#custom-hue-value').textContent = '200°';
      applyRealTime();
    });
    
    themeColorSaturation.addEventListener('input', (e) => {
      panel.querySelector('#theme-color-saturation-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    themeColorSaturation.addEventListener('dblclick', () => {
      themeColorSaturation.value = 50;
      panel.querySelector('#theme-color-saturation-value').textContent = '50%';
      applyRealTime();
    });
    
    themeColorLightness.addEventListener('input', (e) => {
      panel.querySelector('#theme-color-lightness-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    themeColorLightness.addEventListener('dblclick', () => {
      themeColorLightness.value = 50;
      panel.querySelector('#theme-color-lightness-value').textContent = '50%';
      applyRealTime();
    });
    
    customOpacity.addEventListener('input', (e) => {
      panel.querySelector('#custom-opacity-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customOpacity.addEventListener('dblclick', () => {
      customOpacity.value = 20;
      panel.querySelector('#custom-opacity-value').textContent = '20%';
      applyRealTime();
    });
    
    customBlur.addEventListener('input', (e) => {
      panel.querySelector('#custom-blur-value').textContent = `${e.target.value}px`;
      applyRealTime();
    });
    customBlur.addEventListener('dblclick', () => {
      customBlur.value = 50;
      panel.querySelector('#custom-blur-value').textContent = '50px';
      applyRealTime();
    });
    
    customRadius.addEventListener('input', (e) => {
      panel.querySelector('#custom-radius-value').textContent = `${e.target.value}px`;
      applyRealTime();
    });
    customRadius.addEventListener('dblclick', () => {
      customRadius.value = 20;
      panel.querySelector('#custom-radius-value').textContent = '20px';
      applyRealTime();
    });
    
    customBorderOpacity.addEventListener('input', (e) => {
      panel.querySelector('#custom-border-opacity-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customBorderOpacity.addEventListener('dblclick', () => {
      customBorderOpacity.value = 20;
      panel.querySelector('#custom-border-opacity-value').textContent = '20%';
      applyRealTime();
    });
    
    panelSaturation.addEventListener('input', (e) => {
      panel.querySelector('#panel-saturation-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    panelSaturation.addEventListener('dblclick', () => {
      panelSaturation.value = 180;
      panel.querySelector('#panel-saturation-value').textContent = '180%';
      applyRealTime();
    });
    
    panelContrast.addEventListener('input', (e) => {
      panel.querySelector('#panel-contrast-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    panelContrast.addEventListener('dblclick', () => {
      panelContrast.value = 100;
      panel.querySelector('#panel-contrast-value').textContent = '100%';
      applyRealTime();
    });
    
    panelBrightness.addEventListener('input', (e) => {
      panel.querySelector('#panel-brightness-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    panelBrightness.addEventListener('dblclick', () => {
      panelBrightness.value = 100;
      panel.querySelector('#panel-brightness-value').textContent = '100%';
      applyRealTime();
    });
    
    customScale.addEventListener('input', (e) => {
      panel.querySelector('#custom-scale-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customScale.addEventListener('dblclick', () => {
      customScale.value = 100;
      panel.querySelector('#custom-scale-value').textContent = '100%';
      applyRealTime();
    });
    
    customPadding.addEventListener('input', (e) => {
      panel.querySelector('#custom-padding-value').textContent = `${e.target.value}px`;
      applyRealTime();
    });
    customPadding.addEventListener('dblclick', () => {
      customPadding.value = 20;
      panel.querySelector('#custom-padding-value').textContent = '20px';
      applyRealTime();
    });
    
    customButtonSize.addEventListener('input', (e) => {
      panel.querySelector('#custom-button-size-value').textContent = `${e.target.value}px`;
      applyRealTime();
    });
    customButtonSize.addEventListener('dblclick', () => {
      customButtonSize.value = 52;
      panel.querySelector('#custom-button-size-value').textContent = '52px';
      applyRealTime();
    });
    
    customButtonSpacing.addEventListener('input', (e) => {
      panel.querySelector('#custom-button-spacing-value').textContent = `${e.target.value}px`;
      applyRealTime();
    });
    customButtonSpacing.addEventListener('dblclick', () => {
      customButtonSpacing.value = 14;
      panel.querySelector('#custom-button-spacing-value').textContent = '14px';
      applyRealTime();
    });
    
    customButtonGlow.addEventListener('input', (e) => {
      panel.querySelector('#custom-button-glow-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customButtonGlow.addEventListener('dblclick', () => {
      customButtonGlow.value = 30;
      panel.querySelector('#custom-button-glow-value').textContent = '30%';
      applyRealTime();
    });
    
    customButtonSaturation.addEventListener('input', (e) => {
      panel.querySelector('#custom-button-saturation-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customButtonSaturation.addEventListener('dblclick', () => {
      customButtonSaturation.value = 100;
      panel.querySelector('#custom-button-saturation-value').textContent = '100%';
      applyRealTime();
    });
    
    customGlowIntensity.addEventListener('input', (e) => {
      panel.querySelector('#custom-glow-intensity-value').textContent = `${e.target.value}%`;
      applyRealTime();
    });
    customGlowIntensity.addEventListener('dblclick', () => {
      customGlowIntensity.value = 100;
      panel.querySelector('#custom-glow-intensity-value').textContent = '100%';
      applyRealTime();
    });
    
    // Button-style toggle handlers (iOS-like)
    const toggleBtn = (btn) => { if (!btn) return; btn.classList.toggle('active'); syncMenuToggleIcons(); applyRealTime(); };
    if (customBackgroundToggle) customBackgroundToggle.addEventListener('click', () => toggleBtn(customBackgroundToggle));
    if (customShadowToggle) customShadowToggle.addEventListener('click', () => toggleBtn(customShadowToggle));
    if (customSquareButtonsToggle) customSquareButtonsToggle.addEventListener('click', () => toggleBtn(customSquareButtonsToggle));
    // Icons also toggle the corresponding switch
    if (iconSquare) iconSquare.addEventListener('click', () => toggleBtn(customSquareButtonsToggle));
    if (iconBackground) iconBackground.addEventListener('click', () => toggleBtn(customBackgroundToggle));
    if (iconShadow) iconShadow.addEventListener('click', () => toggleBtn(customShadowToggle));
  // Initial sync
  syncMenuToggleIcons();
    
    // Apply custom theme button (keep for manual trigger)
    panel.querySelector('#apply-custom-theme').addEventListener('click', applyRealTime);
    
    // Close panel (stop propagation to avoid side-effects)
    const closeBtn = panel.querySelector('#close-theme-panel');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleThemePanel();
    });
  }
  
  function toggleThemePanel() {
    let panel = document.getElementById('theme-panel');
    const btn = elements.settingsBtn;

    if (!panel) {
      createThemePanel();
      panel = document.getElementById('theme-panel');
    }

    const isDocked = panel.dataset.dragged === 'true';

    const isOpen = panel.classList.contains('show') || panel.classList.contains('show-docked');

    if (!isOpen) {
      // Show panel (mirror playlist logic)
      panel.classList.remove('hidden', 'hidden-docked');
      panel.classList.add(isDocked ? 'show-docked' : 'show');
      // clear any inline display from older logic
      panel.style.display = '';
      // Allow show animation: clear any persistent no-anim flags
      const content = panel.querySelector('.theme-panel-content');
      if (content) {
        content.classList.remove('user-moved', 'dragging');
        content.style.animation = '';
        content.style.transition = '';
      }
      if (btn) btn.classList.add('active');
      setupThemePanelDrag();
      setTimeout(() => {
        if (customThemeSettings && Object.keys(customThemeSettings).length > 0) {
          applyCustomTheme(customThemeSettings);
        } else if (currentTheme) {
          applyTheme(currentTheme);
        }
      }, 60);
    } else {
      // Hide panel (mirror playlist logic)
      panel.classList.remove('show', 'show-docked');
      panel.classList.add(isDocked ? 'hidden-docked' : 'hidden');
      if (btn) btn.classList.remove('active');
      setTimeout(() => {
        panel.classList.remove('hidden', 'hidden-docked');
        // rely on default display:none from CSS when no class present
        panel.style.display = '';
        const content = panel.querySelector('.theme-panel-content');
        if (content) {
          content.classList.remove('user-moved', 'dragging');
          content.style.animation = '';
          content.style.transition = '';
        }
      }, 260);
    }
  }
  
  function setupThemePanelDrag() {
    const content = document.querySelector('.theme-panel-content');
    if (!content) return;

    const panel = content.closest('.theme-panel');
    if (!panel || panel.dataset.dragSetup === 'true') return;

    panel.dataset.dragSetup = 'true';
    content.style.cursor = 'move';

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let pending = null;
  let rafId = null;
  let hasMoved = false;

    content.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.theme-panel-header')) return;
      // Ignore drag when clicking on the close button
      if (e.target.closest('#close-theme-panel')) return;
      isDragging = true;
      const rect = content.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      content.classList.add('dragging');
      // prepare fixed positioning
      content.style.position = 'fixed';
      content.style.margin = '0';
      content.style.right = '';
      content.style.bottom = '';
      // prevent any transform/animation from interfering
      content.style.transform = 'none';
      content.style.animation = 'none';
      content.style.transition = 'none';
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      // Mark as docked immediately so subsequent opens use docked animation
      panel.dataset.dragged = 'true';
      hasMoved = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      const maxX = window.innerWidth - content.offsetWidth - 4;
      const maxY = window.innerHeight - content.offsetHeight - 4;
      newLeft = Math.max(0, Math.min(newLeft, maxX));
      newTop = Math.max(0, Math.min(newTop, maxY));

      pending = { left: newLeft, top: newTop };
      if (!hasMoved) {
        hasMoved = true;
        content.classList.add('user-moved');
      }
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          if (pending) {
            content.style.left = pending.left + 'px';
            content.style.top = pending.top + 'px';
            pending = null;
          }
          rafId = null;
        });
      }
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      content.classList.remove('dragging');
      document.body.style.userSelect = '';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // keep transform none to avoid snap-back; don't restore animation/transition while open
      content.style.transform = 'none';
    });
  }
  
  // ========================================
  // PLAYLIST PANEL
  // ========================================
  
  function updatePlaylistUI(forceRebuild = false) {
    if (!elements.playlistBody) return;
    const body = elements.playlistBody;

    const needsBuild = forceRebuild || playlistItemNodes.length !== playlist.length || body.children.length === 0;
    if (needsBuild) {
      body.innerHTML = '';
      playlistItemNodes = [];
      if (playlist.length === 0) {
        body.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.5);">No tracks loaded</div>';
        return;
      }
      const frag = document.createDocumentFragment();
      playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.index = String(index);
        if (index === currentTrackIndex) item.classList.add('active');
        item.innerHTML = `
          <div class="playlist-item-title">${track.title}</div>
          <div class="playlist-item-artist">${track.artist}</div>
        `;
        item.addEventListener('click', () => {
          currentTrackIndex = index;
          loadTrack(currentTrackIndex);
          // Only update selection highlighting
          updatePlaylistUI(false);
        });
        frag.appendChild(item);
        playlistItemNodes[index] = {
          root: item,
          titleEl: item.querySelector('.playlist-item-title'),
          artistEl: item.querySelector('.playlist-item-artist')
        };
      });
      body.appendChild(frag);
      return;
    }

    // No rebuild: just sync active classes
    playlistItemNodes.forEach((node, idx) => {
      if (!node || !node.root) return;
      if (idx === currentTrackIndex) node.root.classList.add('active');
      else node.root.classList.remove('active');
    });
  }

  function updatePlaylistItem(index) {
    const node = playlistItemNodes[index];
    const track = playlist[index];
    if (!node || !track) return;
    if (node.titleEl && track.title) node.titleEl.textContent = track.title;
    if (node.artistEl && track.artist) node.artistEl.textContent = track.artist;
  }
  
  function togglePlaylistPanel() {
    const panel = elements.playlistPanel;
    const btn = elements.playlistBtn;
    if (!panel) return;
    
    if (panel.classList.contains('hidden') || !panel.classList.contains('show')) {
      // Show panel
      panel.classList.remove('hidden');
      panel.classList.add('show');
      if (btn) btn.classList.add('active');
      updatePlaylistUI();
      setupPlaylistDrag();
      
      // Reapply theme to ensure playlist inherits current styles
      setTimeout(() => {
        if (customThemeSettings && Object.keys(customThemeSettings).length > 0) {
          applyCustomTheme(customThemeSettings);
        } else if (currentTheme) {
          applyTheme(currentTheme);
        }
      }, 80);
    } else {
      // Hide panel
      panel.classList.remove('show');
      panel.classList.add('hidden');
      if (btn) btn.classList.remove('active');
      setTimeout(() => {
        panel.classList.remove('hidden');
      }, 260);
    }
  }
  
  function setupPlaylistDrag() {
    const playlistContent = document.querySelector('.playlist-content');
    if (!playlistContent || playlistContent.dataset.dragSetup) return;
    
    playlistContent.dataset.dragSetup = 'true';
    playlistContent.style.cursor = 'move';
    
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    playlistContent.addEventListener('mousedown', (e) => {
      // Only drag from header area
      if (e.target.closest('.playlist-header')) {
        isDragging = true;
        const rect = playlistContent.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        playlistContent.style.cursor = 'grabbing';
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Limit to viewport
        const maxX = window.innerWidth - playlistContent.offsetWidth;
        const maxY = window.innerHeight - playlistContent.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        playlistContent.style.position = 'fixed';
        playlistContent.style.left = newX + 'px';
        playlistContent.style.top = newY + 'px';
        playlistContent.style.margin = '0';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        playlistContent.style.cursor = 'move';
      }
    });
  }
  
  // ========================================
  // SETTINGS PERSISTENCE
  // ========================================
  
  function saveSettings() {
    const settings = {
      theme: currentTheme,
      customSettings: customThemeSettings,
      volume: elements.audioPlayer.volume,
      shuffle: isShuffleEnabled,
      loop: isLoopEnabled,
      currentTrackIndex: currentTrackIndex,
      playlistMetadata: playlist.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }))
    };
    
    // Use chrome.storage.local for persistence across tab reloads
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 'musictab-settings': settings }, () => {
        console.log('[MusicTab] Settings saved (playlist count: ' + playlist.length + ')');
      });
    }
  }
  
  function loadSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['musictab-settings'], (result) => {
          if (result['musictab-settings']) {
            try {
              const settings = result['musictab-settings'];
              
              // Restore volume
              if (settings.volume !== undefined) {
                elements.audioPlayer.volume = settings.volume;
                elements.volumeSlider.value = Math.round(settings.volume * 100);
                elements.volumeValue.textContent = `${Math.round(settings.volume * 100)}%`;
              }
              
              // Restore shuffle/loop
              if (settings.shuffle) {
                isShuffleEnabled = true;
                elements.shuffleBtn.classList.add('active');
              }
              if (settings.loop) {
                isLoopEnabled = true;
                elements.loopBtn.classList.add('active');
              }
              
              // Restore currentTrackIndex
              if (settings.currentTrackIndex !== undefined) {
                currentTrackIndex = settings.currentTrackIndex;
              }
              
              // Show message about playlist if it was saved
              if (settings.playlistMetadata && settings.playlistMetadata.length > 0) {
                console.log('[MusicTab] Playlist sauvegardée détectée (' + settings.playlistMetadata.length + ' fichiers)');
                console.log('[MusicTab] Vous devez re-sélectionner le dossier pour recharger les fichiers');
                elements.trackTitle.textContent = 'Playlist sauvegardée (' + settings.playlistMetadata.length + ' fichiers)';
                elements.trackArtist.textContent = 'Cliquez sur 📁 pour recharger le dossier';
              }
              
              // Restore theme
              if (settings.customSettings) {
                customThemeSettings = settings.customSettings;
                applyCustomTheme(settings.customSettings);
              } else if (settings.theme) {
                applyTheme(settings.theme);
              }
              
              console.log('[MusicTab] Settings loaded:', settings);
              resolve(true);
            } catch (e) {
              console.error('[MusicTab] Error loading settings:', e);
              resolve(false);
            }
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }
  
  // Initialize with saved settings or default
  loadSettings().then(async (loaded) => {
    if (!loaded) {
      applyTheme('ios');
    }
    
    // Try to load last used directory
    const savedHandle = await loadDirectoryHandle();
    if (savedHandle) {
      console.log('[MusicTab] Loading last used folder...');
      const success = await loadFolderFromHandle(savedHandle);
      if (success) {
        console.log('[MusicTab] ✓ Playlist restored automatically');
      } else {
        console.log('[MusicTab] Could not restore playlist, click 📁 to select folder');
      }
    }
  });
  
  // Set default cover on load
  setDefaultCover();

  // Context menu: disable right-click globally except on the cover (we use our own menu there)
  document.addEventListener('contextmenu', (e) => {
    const onCover = e.target && (e.target.id === 'cover-art' || e.target.closest && e.target.closest('#cover-container'));
    if (onCover) {
      e.preventDefault();
      openCoverMenu(e.clientX, e.clientY);
    } else {
      e.preventDefault();
    }
  });

  // Close cover menu on click elsewhere or Escape
  document.addEventListener('click', (e) => {
    if (!elements.coverMenu) return;
    if (elements.coverMenu.style.display === 'none') return;
    if (!e.target.closest || !e.target.closest('#cover-menu')) {
      elements.coverMenu.classList.remove('show');
      elements.coverMenu.style.display = 'none';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.coverMenu) {
      elements.coverMenu.classList.remove('show');
      elements.coverMenu.style.display = 'none';
    }
  });

  async function openCoverMenu(x, y) {
    if (!elements.coverMenu) return;
    const artist = (playlist[currentTrackIndex] && playlist[currentTrackIndex].artist) || elements.trackArtist.textContent || '';
    const title = (playlist[currentTrackIndex] && playlist[currentTrackIndex].title) || elements.trackTitle.textContent || '';

    // Position within viewport
    const menu = elements.coverMenu;
    menu.style.display = 'block';
    menu.classList.add('show');
    const padding = 8;
    const vw = window.innerWidth, vh = window.innerHeight;
    const rect = { w: 320, h: 280 };
    let left = Math.min(Math.max(padding, x), vw - rect.w - padding);
    let top = Math.min(Math.max(padding, y), vh - rect.h - padding);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    // Initial skeleton (set thumb src via DOM after inject to avoid HTML-escaping issues with data URLs)
    menu.innerHTML = `
      <div class="cover-menu-header">
        <img class="thumb" id="cover-menu-thumb" src="" alt="thumb"/>
        <div>
          <div class="cover-menu-title"></div>
          <div class="muted" id="cover-menu-subtitle"></div>
        </div>
      </div>
      <div class="cover-menu-body" id="cover-menu-body">
        <div class="muted">Fetching a short bio…</div>
      </div>
      <div class="cover-menu-actions">
        <button id="btn-refresh-cover">Refresh Cover</button>
        <button id="btn-open-wiki" disabled>Open Wikipedia</button>
      </div>
    `;
    // Populate header safely
    const titleEl = menu.querySelector('.cover-menu-title');
    const subEl = menu.querySelector('#cover-menu-subtitle');
    if (titleEl) titleEl.textContent = artist || 'Artiste inconnu';
    if (subEl) subEl.textContent = title || '';
    const thumbInit = menu.querySelector('#cover-menu-thumb');
    if (thumbInit) thumbInit.src = elements.coverArt && elements.coverArt.src ? elements.coverArt.src : '';

    // Fetch artist info (Wikipedia)
    const info = await fetchArtistInfo(artist);
  const body = document.getElementById('cover-menu-body');
  const openBtn = document.getElementById('btn-open-wiki');
  const thumb = document.getElementById('cover-menu-thumb');
    if (info) {
      body.innerHTML = `<div class="muted">${info.extract}</div>`;
      if (info.content_urls && info.content_urls.desktop && info.content_urls.desktop.page) {
        openBtn.disabled = false;
        openBtn.onclick = () => window.open(info.content_urls.desktop.page, '_blank');
      }
      if (info.thumbnail && info.thumbnail.source) {
        thumb.src = info.thumbnail.source;
      }
    } else {
      body.innerHTML = `<div class="muted">No bio found for "${artist}".</div>`;
    }

    // Bind refresh cover
    document.getElementById('btn-refresh-cover').onclick = async () => {
      try {
        // 1) Try iTunes first
        const meta = await fetchItunesMetadata(artist || '', title || '');
        let artworkUrl = meta && meta.artwork ? meta.artwork : null;

        // 2) Fallback to Wikipedia image if available
        if (!artworkUrl && info) {
          if (info.originalimage && info.originalimage.source) artworkUrl = info.originalimage.source;
          else if (info.thumbnail && info.thumbnail.source) artworkUrl = info.thumbnail.source;
        }

        if (artworkUrl) {
          const img = new Image();
          img.onload = () => {
            elements.coverArt.src = artworkUrl;
            applyCoverFilters();
            updateCoverBackground(artworkUrl);
            menu.classList.remove('show');
            menu.style.display = 'none';
          };
          img.onerror = () => {
            body.innerHTML = `<div class="muted">Couldn't apply the new cover image.</div>`;
          };
          img.src = artworkUrl;
        } else {
          body.innerHTML = `<div class="muted">Couldn't find a new cover via iTunes or Wikipedia.</div>`;
        }
      } catch (e) {
        console.error(e);
        body.innerHTML = `<div class="muted">Error while searching for a cover image.</div>`;
      }
    };
  }

  async function fetchArtistInfo(artist) {
    if (!artist || /unknown/i.test(artist)) return null;
    try {
      // Try direct summary
      let res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist)}`);
      if (res.ok) return await res.json();
      // Fallback: search for the best title
      res = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(artist)}&limit=1`);
      if (!res.ok) return null;
      const data = await res.json();
      const page = data && data.pages && data.pages[0];
      if (!page || !page.title) return null;
      const res2 = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`);
      if (!res2.ok) return null;
      return await res2.json();
    } catch (e) {
      console.error('[MusicTab] Wikipedia fetch error', e);
      return null;
    }
  }

  // Settings - Theme Panel
  elements.settingsBtn.addEventListener('click', toggleThemePanel);
  
  // Playlist Panel
  elements.playlistBtn.addEventListener('click', togglePlaylistPanel);
  if (elements.closePlaylistBtn) {
    elements.closePlaylistBtn.addEventListener('click', togglePlaylistPanel);
  }
  
  // Subtle cover hover motion (parallax-style translate)
  (function setupCoverHoverMotion() {
    const container = document.getElementById('cover-container');
    if (!container) return;
    let rafId = null;
    let tx = 0, ty = 0;
    let targetTx = 0, targetTy = 0;
    const maxShift = 6; // px
    function step() {
      // simple easing toward target
      tx += (targetTx - tx) * 0.18;
      ty += (targetTy - ty) * 0.18;
      container.style.setProperty('--cov-tx', tx.toFixed(2) + 'px');
      container.style.setProperty('--cov-ty', ty.toFixed(2) + 'px');
      if (Math.abs(targetTx - tx) > 0.1 || Math.abs(targetTy - ty) > 0.1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }
    function onMove(e) {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      targetTx = Math.max(-1, Math.min(1, dx)) * maxShift;
      targetTy = Math.max(-1, Math.min(1, dy)) * maxShift;
      if (rafId === null) rafId = requestAnimationFrame(step);
    }
    function onLeave() {
      targetTx = 0; targetTy = 0;
      if (rafId === null) rafId = requestAnimationFrame(step);
    }
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
  })();
  
  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  
  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && playlist.length > 0) {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      previousTrack();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextTrack();
    }
  });

  console.log('[MusicTab] Player initialized');
})();

