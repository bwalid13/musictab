
(function() {
  'use strict';
  
  if (window.cinemaModeUltimateLoaded) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'toggleCinemaMode' && !document.getElementById('cmu-overlay')) {
        window.toggleCinemaMode();
      }
    });
    return;
  }
  window.cinemaModeUltimateLoaded = true;


// 🔧 CONSTANTS - IDs, Classes, Icons

const OVERLAY_ID = 'cmu-overlay';
const CONTROLS_ID = 'cmu-controls-container';
const SHORTS_CONTROLS_ID = 'cmu-shorts-controls-container';
const SETTINGS_ID = 'cmu-settings-panel';
const AMBIANCE_ID = 'cmu-ambiance-canvas';
const STYLES_ID = 'cmu-styles';
const ACTIVE_VIDEO_CLASS = 'cmu-active-video';
const SHORTCUT_GUIDE_ID = 'cmu-shortcut-guide';
const YOUTUBE_LOGO_ID = 'cmu-youtube-logo';
const AUDIO_MODE_CONTAINER_ID = 'cmu-audio-mode-container';
const AUDIO_COVER_ID = 'cmu-audio-cover';
const ICONS = {
  play: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M8 5v14l11-7z"></path></svg>`,
  pause: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`,
  volumeHigh: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`,
  volumeMute: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>`,
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>`,
  close: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`,
  fullscreen: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path></svg>`,
  ambianceOn: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6m0-2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"></path></svg>`,
  ambianceOff: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>`,
  nextTrack: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M16 6h2v12h-2zm-4.5 6L4 6v12l7.5-6z"></path></svg>`,
  prevTrack: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6z"></path></svg>`,
  lyrics: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"></path></svg>`,
  audioMode: `<svg width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"></path></svg>`,
};


// 🎨 UI THEMES - Catégories et Définitions

const THEME_CATEGORIES = {
  focus: { name: 'Focus & Productivité', icon: '🧠' },
  immersive: { name: 'Immersif & Cinématographique', icon: '🎬' },
  expressive: { name: 'Artistique & Expressif', icon: '🎭' },
  custom: { name: 'Personnalisé', icon: '🎨' },
};

// Complete UI Themes - every theme follows the same value schema for reliable inheritance
const UI_THEMES = {
  // --- Focus & Productivité ---
  light: {
    name: 'Light (iOS Style)',
    icon: '☀️',
    category: 'focus',
    isDark: false,
    values: {
      hue: 210,
      menuOpacity: 0.95,
      menuBlur: 18,
      menuSaturation: 120,
      menuBrightness: 105,
      menuContrast: 115,
      menuBorderOpacity: 0.12,
      hideControlBar: false,      controlBarOpacity: 0.60,
      controlBarBlur: 22,
      controlBarSaturation: 110,
      controlBarBrightness: 105,
      controlBarContrast: 115,
      buttonShape: 'circle',
      buttonBgOpacity: 0.08,
      buttonBorderOpacity: 0.16,
      buttonHoverBgOpacity: 0.16,
      menuTextLightness: 12,
      buttonTextLightness: 12,
      menuHeadingLightness: 10,
    },
    // 🎨 Glassmorphism Settings (iOS Crystalline Style)
    glassmorphism: {
      enabled: true,
      backgroundOpacity: 0.15,        // Transparency of the glass
      backdropBlur: 33,                // Backdrop blur intensity (px)
      backdropSaturate: 180,           // Color saturation (%)
      backdropBrightness: 120,         // Brightness adjustment (%)
      borderOpacity: 0.18,             // Border shine opacity
      shadowIntensity: 0.3,            // Shadow depth
      blendMode: 'overlay',            // Background blend mode
    },
    progressGradient: 'linear-gradient(90deg, #0A84FF 0%, #64D2FF 50%, #B4E8FF 100%)',
    progressShadow: 'rgba(10, 132, 255, 0.6)',
  },
  dark: {
    name: 'Dark (macOS Style)',
    icon: '🌙',
    category: 'focus',
    isDark: true,
    values: {
      hue: 220,
      menuOpacity: 0.88,
      menuBlur: 50,
      menuSaturation: 140,
      menuBrightness: 100,
      menuContrast: 120,
      menuBorderOpacity: 0.18,
      hideControlBar: false,      controlBarOpacity: 0.57,
      controlBarBlur: 40,
      controlBarSaturation: 130,
      controlBarBrightness: 100,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.1,
      buttonBorderOpacity: 0.18,
      buttonHoverBgOpacity: 0.2,
      menuTextLightness: 98,
      buttonTextLightness: 98,
      menuHeadingLightness: 92,
    },
    // 🎨 Glassmorphism Settings (macOS Big Sur Style)
    glassmorphism: {
      enabled: true,
      backgroundOpacity: 0.1,          // Very transparent glass
      backdropBlur: 60,                // Strong blur for macOS look
      backdropSaturate: 180,           // Rich colors
      backdropBrightness: 100,         // Normal brightness
      borderOpacity: 0.2,              // Subtle border shine
      shadowIntensity: 0.4,            // Deeper shadow
      blendMode: 'normal',             // macOS uses normal blend
    },
    progressGradient: 'linear-gradient(90deg, #0A52A0 0%, #6366F1 50%, #64A5FF 100%)',
    progressShadow: 'rgba(99, 102, 241, 0.6)',
  },
  windows11: {
    name: 'Windows 11 (Acrylic)',
    icon: '🪟',
    category: 'focus',
    isDark: true,
    values: {
      hue: 220,
      menuOpacity: 0.85,
      menuBlur: 45,
      menuSaturation: 150,
      menuBrightness: 105,
      menuContrast: 118,
      menuBorderOpacity: 0.15,
      hideControlBar: false,
      controlBarOpacity: 0.55,
      controlBarBlur: 35,
      controlBarSaturation: 145,
      controlBarBrightness: 105,
      controlBarContrast: 118,
      buttonShape: 'circle',
      buttonBgOpacity: 0.11,
      buttonBorderOpacity: 0.17,
      buttonHoverBgOpacity: 0.21,
      menuTextLightness: 96,
      buttonTextLightness: 96,
      menuHeadingLightness: 90,
    },
    // 🎨 Glassmorphism Settings (Windows 11 Acrylic Material)
    glassmorphism: {
      enabled: true,
      backgroundOpacity: 0.2,          // Slightly more opaque for Acrylic
      backdropBlur: 50,                // Medium blur
      backdropSaturate: 150,           // Enhanced saturation
      backdropBrightness: 110,         // Slightly brighter
      borderOpacity: 0.15,             // Subtle border
      shadowIntensity: 0.35,           // Balanced shadow
      blendMode: 'overlay',            // Acrylic blend effect
    },
    progressGradient: 'linear-gradient(90deg, #0078D4 0%, #50A0E8 50%, #90D0FF 100%)',
    progressShadow: 'rgba(0, 120, 212, 0.6)',
  },
  studio: {
    name: 'Studio',
    icon: '🎙️',
    category: 'focus',
    isDark: true,
    values: {
      hue: 210,
      menuOpacity: 0.98,        // OPAQUE - environnement pro
      menuBlur: 0,              // Pas de flou - netteté pro
      menuSaturation: 0,        // Monochrome pro
      menuBrightness: 85,       // Éclairage studio
      menuContrast: 140,        // Contraste élevé pour lisibilité
      menuBorderOpacity: 0.25,  // Bordures nettes
      hideControlBar: false,
      controlBarOpacity: 0.95,  // Barre opaque et fonctionnelle
      controlBarBlur: 0,        // Pas de flou
      controlBarSaturation: 0,
      controlBarBrightness: 90,
      controlBarContrast: 135,
      buttonShape: 'square',    // Forme carrée pro
      buttonBgOpacity: 0.15,
      buttonBorderOpacity: 0.3,
      buttonHoverBgOpacity: 0.35,
      menuTextLightness: 95,    // Texte contrasté
      buttonTextLightness: 95,
      menuHeadingLightness: 90,
    },
    progressGradient: 'linear-gradient(90deg, #404040 0%, #808080 50%, #C0C0C0 100%)',
    progressShadow: 'rgba(128, 128, 128, 0.8)',
  },
  eink: {
    name: 'E-Ink',
    icon: '📰',
    category: 'focus',
    isDark: false,
    values: {
      hue: 0,
      menuOpacity: 1.0,         // OPAQUE - comme vrai e-ink
      menuBlur: 0,              // Pas de flou - netteté e-ink
      menuSaturation: 0,        // Noir et blanc pur
      menuBrightness: 110,      // Blanc papier
      menuContrast: 200,        // Contraste maximum type e-ink
      menuBorderOpacity: 0.4,   // Bordures noires nettes
      hideControlBar: false,
      controlBarOpacity: 1.0,   // Barre totalement opaque
      controlBarBlur: 0,
      controlBarSaturation: 0,
      controlBarBrightness: 115,
      controlBarContrast: 200,
      buttonShape: 'square',    // Carrés nets type e-reader
      buttonBgOpacity: 0.1,     // Fond gris très léger
      buttonBorderOpacity: 0.6, // Bordures marquées
      buttonHoverBgOpacity: 0.2,
      menuTextLightness: 0,     // Noir pur
      buttonTextLightness: 0,
      menuHeadingLightness: 0,
    },
    progressGradient: 'linear-gradient(90deg, #000 0%, #333 50%, #666 100%)',
    progressShadow: 'rgba(0, 0, 0, 0.8)',
  },

  // --- Immersif & Cinématographique ---
  youtube: {
    name: 'YouTube',
    icon: '📺',
    category: 'immersive',
    isDark: true,
    values: {
      hue: 0,
      menuOpacity: 0.15,        // TRÈS transparent pour voir la vidéo
      menuBlur: 60,             // Flou fort pour effet glassmorphism
      menuSaturation: 200,      // Saturé pour l'identité YouTube
      menuBrightness: 90,
      menuContrast: 130,
      menuBorderOpacity: 0.1,   // Bordure très subtile
      hideControlBar: false,
      controlBarOpacity: 0.20,  // Barre de contrôle très transparente
      controlBarBlur: 80,       // Flou maximal
      controlBarSaturation: 200,
      controlBarBrightness: 85,
      controlBarContrast: 125,
      buttonShape: 'circle',
      buttonBgOpacity: 0.08,    // Boutons très transparents
      buttonBorderOpacity: 0.15,
      buttonHoverBgOpacity: 0.25,
      menuTextLightness: 100,   // Texte blanc pur
      buttonTextLightness: 100,
      menuHeadingLightness: 100,
    },
    progressGradient: 'linear-gradient(90deg, #FF0000 0%, #FF4444 50%, #FF6B35 100%)',
    progressShadow: 'rgba(255, 0, 0, 0.8)',
  },
  midnight: {
    name: 'Midnight',
    icon: '🤫',
    category: 'immersive',
    isDark: true,
    values: {
      hue: 240,
      menuOpacity: 0.05,        // Quasi-invisible pour immersion totale
      menuBlur: 100,            // Flou maximum
      menuSaturation: 80,       // Désaturé pour effet nocturne
      menuBrightness: 60,       // Très sombre
      menuContrast: 110,
      menuBorderOpacity: 0.03,  // Bordure imperceptible
      hideControlBar: true,     // Barre cachée par défaut
      controlBarOpacity: 0.08,  // Ultra-transparent quand visible
      controlBarBlur: 120,      // Flou extrême
      controlBarSaturation: 60,
      controlBarBrightness: 50,
      controlBarContrast: 100,
      buttonShape: 'circle',
      buttonBgOpacity: 0.03,    // Boutons fantômes
      buttonBorderOpacity: 0.06,
      buttonHoverBgOpacity: 0.15,
      menuTextLightness: 75,    // Texte atténué
      buttonTextLightness: 75,
      menuHeadingLightness: 70,
    },
    progressGradient: 'linear-gradient(90deg, #1a1a3a 0%, #2a2a5a 50%, #3a3a6a 100%)',
    progressShadow: 'rgba(42, 42, 90, 0.4)',
  },
  neon: {
    name: 'Neon',
    icon: '💜',
    category: 'immersive',
    isDark: true,
    values: {
      hue: 300,
      menuOpacity: 0.95,        // Plus opaque pour les néons
      menuBlur: 15,             // Flou réduit pour netteté néon
      menuSaturation: 250,      // Saturation extrême
      menuBrightness: 120,      // Très lumineux
      menuContrast: 160,        // Contraste élevé
      menuBorderOpacity: 0.6,   // Bordures néon visibles
      hideControlBar: false,
      controlBarOpacity: 0.85,  // Barre bien visible
      controlBarBlur: 12,
      controlBarSaturation: 230,
      controlBarBrightness: 115,
      controlBarContrast: 150,
      buttonShape: 'square',    // Forme néon
      buttonBgOpacity: 0.3,     // Fond néon visible
      buttonBorderOpacity: 0.7, // Bordures néon marquées
      buttonHoverBgOpacity: 0.5,
      menuTextLightness: 95,    // Texte blanc éclatant
      buttonTextLightness: 95,
      menuHeadingLightness: 100,
    },
    progressGradient: 'linear-gradient(90deg, #FF00FF 0%, #00FFFF 50%, #39FF14 100%)',
    progressShadow: 'rgba(255, 0, 255, 1.0)', // Ombre néon intense
  },
  dracula: {
    name: 'Dracula',
    icon: '🧛',
    category: 'immersive',
    isDark: true,
    values: {
      hue: 280,
      menuOpacity: 0.94,
      menuBlur: 18,
      menuSaturation: 150,
      menuBrightness: 90,
      menuContrast: 135,
      menuBorderOpacity: 0.25,
      hideControlBar: false,      controlBarOpacity: 0.63,
      controlBarBlur: 18,
      controlBarSaturation: 150,
      controlBarBrightness: 90,
      controlBarContrast: 130,
      buttonShape: 'circle',
      buttonBgOpacity: 0.2,
      buttonBorderOpacity: 0.38,
      buttonHoverBgOpacity: 0.32,
      menuTextLightness: 97,
      buttonTextLightness: 97,
      menuHeadingLightness: 88,
    },
    progressGradient: 'linear-gradient(90deg, #BD93F9 0%, #FF79C6 50%, #FF92DF 100%)',
    progressShadow: 'rgba(189, 147, 249, 0.6)',
  },
  synthwave: {
    name: 'Synthwave',
    icon: '🌴',
    category: 'immersive',
    isDark: true,
    values: {
      hue: 290,
      menuOpacity: 0.86,
      menuBlur: 18,
      menuSaturation: 210,
      menuBrightness: 92,
      menuContrast: 130,
      menuBorderOpacity: 0.22,
      hideControlBar: true,      controlBarOpacity: 0.52,
      controlBarBlur: 22,
      controlBarSaturation: 170,
      controlBarBrightness: 90,
      controlBarContrast: 120,
      buttonShape: 'square',
      buttonBgOpacity: 0.12,
      buttonBorderOpacity: 0.3,
      buttonHoverBgOpacity: 0.22,
      menuTextLightness: 86,
      buttonTextLightness: 86,
      menuHeadingLightness: 90,
    },
    progressGradient: 'linear-gradient(90deg, #F92C86 0%, #FF6B9A 50%, #00FFFF 100%)',
    progressShadow: 'rgba(249, 44, 134, 0.7)',
  },

  // --- Artistique & Expressif ---
  aurora: {
    name: 'Aurora',
    icon: '🌌',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 170,
      menuOpacity: 0.72,
      menuBlur: 60,
      menuSaturation: 180,
      menuBrightness: 98,
      menuContrast: 125,
      menuBorderOpacity: 0.18,
      hideControlBar: false,      controlBarOpacity: 0.62,
      controlBarBlur: 52,
      controlBarSaturation: 180,
      controlBarBrightness: 98,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.16,
      buttonBorderOpacity: 0.3,
      buttonHoverBgOpacity: 0.26,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 98,
    },
    progressGradient: 'linear-gradient(90deg, #00FF9F 0%, #00BFFF 50%, #9370DB 100%)',
    progressShadow: 'rgba(0, 191, 255, 0.6)',
  },
  gradient: {
    name: 'Gradient',
    icon: '🌈',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 30,
      menuOpacity: 0.8,
      menuBlur: 44,
      menuSaturation: 200,
      menuBrightness: 100,
      menuContrast: 125,
      menuBorderOpacity: 0.2,
      hideControlBar: false,      controlBarOpacity: 0.45,
      controlBarBlur: 32,
      controlBarSaturation: 200,
      controlBarBrightness: 100,
      controlBarContrast: 125,
      buttonShape: 'circle',
      buttonBgOpacity: 0.16,
      buttonBorderOpacity: 0.24,
      buttonHoverBgOpacity: 0.26,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 98,
    },
    progressGradient: 'linear-gradient(90deg, #F89B29 0%, #FF4E50 50%, #C850C0 100%)',
    progressShadow: 'rgba(255, 78, 80, 0.6)',
  },
  blueSky: {
    name: 'Blue Sky',
    icon: '☁️',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 200,
      menuOpacity: 0.64,
      menuBlur: 78,
      menuSaturation: 160,
      menuBrightness: 102,
      menuContrast: 120,
      menuBorderOpacity: 0.18,
      hideControlBar: false,      controlBarOpacity: 0.64,
      controlBarBlur: 64,
      controlBarSaturation: 160,
      controlBarBrightness: 102,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.16,
      buttonBorderOpacity: 0.28,
      buttonHoverBgOpacity: 0.26,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 98,
    },
    progressGradient: 'linear-gradient(90deg, #0080FF 0%, #00CED1 50%, #87CEEB 100%)',
    progressShadow: 'rgba(0, 206, 209, 0.6)',
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 25,
      menuOpacity: 0.76,
      menuBlur: 42,
      menuSaturation: 190,
      menuBrightness: 95,
      menuContrast: 135,
      menuBorderOpacity: 0.2,
      hideControlBar: true,      controlBarOpacity: 0.52,
      controlBarBlur: 34,
      controlBarSaturation: 180,
      controlBarBrightness: 92,
      controlBarContrast: 125,
      buttonShape: 'circle',
      buttonBgOpacity: 0.2,
      buttonBorderOpacity: 0.32,
      buttonHoverBgOpacity: 0.3,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 95,
    },
    progressGradient: 'linear-gradient(90deg, #FF6B35 0%, #FF5E78 50%, #9D4EDD 100%)',
    progressShadow: 'rgba(255, 94, 120, 0.6)',
  },
  forest: {
    name: 'Forest',
    icon: '🌲',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 140,
      menuOpacity: 0.86,
      menuBlur: 34,
      menuSaturation: 150,
      menuBrightness: 95,
      menuContrast: 120,
      menuBorderOpacity: 0.2,
      hideControlBar: false,      controlBarOpacity: 0.57,
      controlBarBlur: 26,
      controlBarSaturation: 150,
      controlBarBrightness: 95,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.16,
      buttonBorderOpacity: 0.28,
      buttonHoverBgOpacity: 0.26,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 98,
    },
    progressGradient: 'linear-gradient(90deg, #228B22 0%, #7FFF00 50%, #ADFF2F 100%)',
    progressShadow: 'rgba(127, 255, 0, 0.6)',
  },
  ocean: {
    name: 'Ocean Deep',
    icon: '🌊',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 200,
      menuOpacity: 0.9,
      menuBlur: 36,
      menuSaturation: 160,
      menuBrightness: 95,
      menuContrast: 130,
      menuBorderOpacity: 0.22,
      hideControlBar: true,      controlBarOpacity: 0.54,
      controlBarBlur: 34,
      controlBarSaturation: 160,
      controlBarBrightness: 94,
      controlBarContrast: 125,
      buttonShape: 'circle',
      buttonBgOpacity: 0.16,
      buttonBorderOpacity: 0.3,
      buttonHoverBgOpacity: 0.26,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 95,
    },
    progressGradient: 'linear-gradient(90deg, #003366 0%, #0077BE 50%, #40E0D0 100%)',
    progressShadow: 'rgba(0, 119, 190, 0.6)',
  },
  fire: {
    name: 'Fire',
    icon: '🔥',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 18,
      menuOpacity: 0.82,
      menuBlur: 28,
      menuSaturation: 210,
      menuBrightness: 98,
      menuContrast: 140,
      menuBorderOpacity: 0.22,
      hideControlBar: false,      controlBarOpacity: 0.57,
      controlBarBlur: 22,
      controlBarSaturation: 200,
      controlBarBrightness: 100,
      controlBarContrast: 135,
      buttonShape: 'circle',
      buttonBgOpacity: 0.2,
      buttonBorderOpacity: 0.32,
      buttonHoverBgOpacity: 0.32,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 95,
    },
    progressGradient: 'linear-gradient(90deg, #8B0000 0%, #FF4500 50%, #FFD700 100%)',
    progressShadow: 'rgba(255, 69, 0, 0.6)',
  },
  nature: {
    name: 'Nature',
    icon: '🌿',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 120,
      menuOpacity: 0.9,
      menuBlur: 24,
      menuSaturation: 140,
      menuBrightness: 96,
      menuContrast: 120,
      menuBorderOpacity: 0.18,
      hideControlBar: false,      controlBarOpacity: 0.61,
      controlBarBlur: 26,
      controlBarSaturation: 135,
      controlBarBrightness: 96,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.12,
      buttonBorderOpacity: 0.22,
      buttonHoverBgOpacity: 0.2,
      menuTextLightness: 98,
      buttonTextLightness: 98,
      menuHeadingLightness: 94,
    },
    progressGradient: 'linear-gradient(90deg, #2E7D32 0%, #4CAF50 50%, #A5D6A7 100%)',
    progressShadow: 'rgba(76, 175, 80, 0.6)',
  },
  hulk: {
    name: 'Hulk',
    icon: '💪',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 120,
      menuOpacity: 1.0,         // COMPLÈTEMENT OPAQUE - force brute
      menuBlur: 0,              // Pas de flou - puissance directe
      menuSaturation: 200,      // Vert intense
      menuBrightness: 100,      // Couleur pure
      menuContrast: 150,        // Contraste puissant
      menuBorderOpacity: 0.8,   // Bordures marquées
      hideControlBar: false,
      controlBarOpacity: 0.95,  // Barre puissante
      controlBarBlur: 0,
      controlBarSaturation: 190,
      controlBarBrightness: 105,
      controlBarContrast: 140,
      buttonShape: 'square',    // Forme brutale
      buttonBgOpacity: 0.4,     // Fond vert visible
      buttonBorderOpacity: 0.6,
      buttonHoverBgOpacity: 0.7,// Hover intense
      menuTextLightness: 100,   // Texte blanc pur
      buttonTextLightness: 100,
      menuHeadingLightness: 100,
    },
    progressGradient: 'linear-gradient(90deg, #00A86B 0%, #00FF41 50%, #7FFF00 100%)',
    progressShadow: 'rgba(0, 255, 65, 1.0)',
  },
  sahara: {
    name: 'Sahara',
    icon: '🏜️',
    category: 'expressive',
    isDark: true,
    values: {
      hue: 35,
      menuOpacity: 0.9, // Very opaque - desert warmth
      menuBlur: 20,
      menuSaturation: 140,
      menuBrightness: 92,
      menuContrast: 125,
      menuBorderOpacity: 0.25,
      hideControlBar: false,      controlBarOpacity: 0.60,
      controlBarBlur: 18,
      controlBarSaturation: 135,
      controlBarBrightness: 94,
      controlBarContrast: 125,
      buttonShape: 'circle',
      buttonBgOpacity: 0.2,
      buttonBorderOpacity: 0.32,
      buttonHoverBgOpacity: 0.3,
      menuTextLightness: 96,
      buttonTextLightness: 96,
      menuHeadingLightness: 92,
    },
    progressGradient: 'linear-gradient(90deg, #C19A6B 0%, #E6C68A 50%, #FFE4B5 100%)',
    progressShadow: 'rgba(193, 154, 107, 0.6)',
  },
  auto: {
    name: 'Auto',
    icon: '🌓',
    category: 'focus',
    isDark: null, // Will be determined by time of day
    auto: true, // Special flag for auto-switching
    values: {
      // These values will be dynamically set based on time
      hue: 200,
      menuOpacity: 0.85,
      menuBlur: 40,
      menuSaturation: 140,
      menuBrightness: 100,
      menuContrast: 120,
      menuBorderOpacity: 0.18,
      hideControlBar: false,      controlBarOpacity: 0.455,
      controlBarBlur: 35,
      controlBarSaturation: 140,
      controlBarBrightness: 100,
      controlBarContrast: 120,
      buttonShape: 'circle',
      buttonBgOpacity: 0.12,
      buttonBorderOpacity: 0.2,
      buttonHoverBgOpacity: 0.2,
      menuTextLightness: 95,
      buttonTextLightness: 95,
      menuHeadingLightness: 92,
    },
    progressGradient: 'linear-gradient(90deg, #0A84FF 0%, #64D2FF 50%, #B4E8FF 100%)',
    progressShadow: 'rgba(10, 132, 255, 0.6)',
  },

  // --- Custom ---
  custom: {
    name: 'Custom',
    icon: '🎨',
    category: 'custom',
    isDark: true,
    customizable: true,
    values: {
      hue: 200,
      menuOpacity: 0.7,
      menuBlur: 40,
      menuSaturation: 180,
      menuBrightness: 100,
      menuContrast: 100,
      menuBorderOpacity: 0.15,
      hideControlBar: false,      controlBarOpacity: 0.65,
      controlBarBlur: 30,
      controlBarSaturation: 180,
      controlBarBrightness: 100,
      controlBarContrast: 100,
      buttonShape: 'circle',
      buttonBgOpacity: 0.12,
      buttonBorderOpacity: 0.2,
      buttonHoverBgOpacity: 0.2,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 97,
    },
    progressGradient: 'linear-gradient(90deg, hsl(var(--custom-hue), 70%, 50%) 0%, hsl(var(--custom-hue), 70%, 60%) 50%, hsl(var(--custom-hue), 70%, 70%) 100%)',
    progressShadow: 'hsla(var(--custom-hue), 70%, 50%, 0.5)',
  },

  // 🎮 RGB GAMING THEME - Changement automatique de couleurs
  rgbGaming: {
    name: 'RGB Gaming',
    icon: '🎮',
    category: 'expressive',
    isDark: true,
    animated: true,
    values: {
      hue: 0, // Will change automatically
      menuOpacity: 0.85,
      menuBlur: 35,
      menuSaturation: 200,      // Saturation maximale
      menuBrightness: 110,      // Couleurs vives
      menuContrast: 130,
      menuBorderOpacity: 0.3,   // Bordures visibles
      hideControlBar: false,
      controlBarOpacity: 0.75,
      controlBarBlur: 25,
      controlBarSaturation: 200,
      controlBarBrightness: 115,
      controlBarContrast: 125,
      buttonShape: 'square',    // Style gaming
      buttonBgOpacity: 0.2,
      buttonBorderOpacity: 0.4,
      buttonHoverBgOpacity: 0.4,
      menuTextLightness: 100,
      buttonTextLightness: 100,
      menuHeadingLightness: 95,
    },
    // Gradient qui change avec l'animation RGB
    progressGradient: 'linear-gradient(90deg, hsl(var(--rgb-hue), 100%, 50%) 0%, hsl(calc(var(--rgb-hue) + 60), 100%, 60%) 50%, hsl(calc(var(--rgb-hue) + 120), 100%, 70%) 100%)',
    progressShadow: 'hsla(var(--rgb-hue), 100%, 50%, 0.8)',
  },
};


// 🎲 RANDOM THEME GENERATOR

function generateRandomTheme() {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360);
  
  // Generate 3 harmonious colors (triad: +120° and +240°)
  const hue2 = (hue + 120) % 360;
  const hue3 = (hue + 240) % 360;
  
  // Randomly choose between dark and light theme
  const isDark = Math.random() > 0.4; // 60% chance of dark theme
  
  // Random variation for more diversity
  const opacityVariation = Math.random() * 0.2; // 0-0.2
  const blurVariation = Math.floor(Math.random() * 40); // 0-40
  const satVariation = Math.floor(Math.random() * 100); // 0-100
  
  // Generate harmonious values with safe ranges
  const theme = {
    name: 'Random',
    icon: '🎲',
    category: 'custom',
    isDark: isDark,
    values: {
      hue: hue,
      // Menu values - MORE variation for uniqueness
      menuOpacity: 0.7 + opacityVariation,              // 0.7-0.9
      menuBlur: 15 + blurVariation,                     // 15-55
      menuSaturation: 120 + satVariation,               // 120-220
      menuBrightness: 90 + Math.floor(Math.random() * 20),  // 90-110
      menuContrast: 100 + Math.floor(Math.random() * 40),   // 100-140
      menuBorderOpacity: 0.08 + Math.random() * 0.25,   // 0.08-0.33
      
      hideControlBar: Math.random() > 0.7,  // 30% chance to hide
      // Control bar values - DIFFERENT from menu
      controlBarOpacity: 0.5 + Math.random() * 0.35,    // 0.5-0.85
      controlBarBlur: 15 + Math.floor(Math.random() * 50), // 15-65
      controlBarSaturation: 100 + Math.floor(Math.random() * 100), // 100-200
      controlBarBrightness: 85 + Math.floor(Math.random() * 20),   // 85-105
      controlBarContrast: 100 + Math.floor(Math.random() * 35),    // 100-135
      
      // Button style - random shape
      buttonShape: Math.random() > 0.5 ? 'circle' : 'square',
      buttonBgOpacity: 0.06 + Math.random() * 0.16,     // 0.06-0.22
      buttonBorderOpacity: 0.1 + Math.random() * 0.3,   // 0.1-0.4
      buttonHoverBgOpacity: 0.12 + Math.random() * 0.2, // 0.12-0.32
      
      // Text colors based on isDark
      menuTextLightness: isDark ? 85 + Math.floor(Math.random() * 15) : 5 + Math.floor(Math.random() * 15),
      buttonTextLightness: isDark ? 85 + Math.floor(Math.random() * 15) : 5 + Math.floor(Math.random() * 15),
      menuHeadingLightness: isDark ? 80 + Math.floor(Math.random() * 18) : 0 + Math.floor(Math.random() * 12),
    },
    // Generate progress gradient with 3 harmonious colors (triad)
    progressGradient: `linear-gradient(90deg, hsl(${hue}, 75%, 55%) 0%, hsl(${hue2}, 80%, 58%) 50%, hsl(${hue3}, 75%, 55%) 100%)`,
    progressShadow: `hsla(${hue2}, 80%, 58%, 0.7)`,
  };
  
  return theme;
}
const defaultSettings = {
  ambianceEnabled: true,
  ambianceBlur: 120,
  ambianceOpacity: 0.9,
  ambianceSaturation: 1.2,
  ambianceHue: 0,
  videoBorderRadius: 35,
  videoMaxSize: 75,
  cursorHideDelay: 3,
  videoShadowBlur: 60,
  videoShadowOpacity: 0.8,
  videoShadowX: 0,
  videoShadowY: 20,
  uiTheme: 'youtube', // Default to YouTube theme
  
  // ============================================
  // 🎨 CUSTOM THEME ENGINE - UNIFIED WITH PRESET THEMES
  // Ces paramètres correspondent EXACTEMENT aux thèmes prédéfinis (iOS, Mac, Windows, etc.)
  // ============================================
  
  // Base Color
  customHue: 200, // 0-360° - Couleur de base du thème
  
  // Menu Settings (identique aux presets: menuOpacity, menuBlur, etc.)
  customMenuOpacity: 0.7,
  customMenuBlur: 40,
  customMenuSaturation: 180,
  customMenuBrightness: 100,
  customMenuContrast: 100,
  customMenuBorderOpacity: 0.15,
  customMenuTextLightness: 100,   // 0-100% for HSL lightness
  customMenuHeadingLightness: 97, // 0-100% for HSL lightness (titres de sections)
  
  // Control Bar Settings (identique aux presets: controlBarOpacity, controlBarBlur, etc.)
  customControlBarOpacity: 0.65,
  customControlBarBlur: 30,
  customControlBarSaturation: 180,
  customControlBarBrightness: 100,
  customControlBarContrast: 100,
  
  // Control Bar Display Mode Toggles
  showControlBarBg: true,      // Mode Normal: Show/hide background (ON by default)
  showCapsuleBorder: true,     // Mode Capsule: Show/hide border (ON by default)
  
  // Control Bar Advanced (spécifique au Custom Theme)
  customControlBarStyle: 'normal', // 'normal', 'gradient', 'capsule'
  customControlBarWidth: 90,       // Width percentage (60-100%) for capsule style
  customControlBarHeight: 70,      // Height in pixels for capsule style
  customControlBarPadding: 20,     // Padding for capsule style
  
  // Button Settings (hérités des thèmes - gérés automatiquement)
  buttonShape: 'circle',              // 'circle' or 'square' (utilisé par tous les thèmes)
  customButtonBgOpacity: 0.12,
  customButtonBorderOpacity: 0.2,
  customButtonHoverBgOpacity: 0.2,
  customButtonTextLightness: 100,     // 0-100% for HSL lightness
  customButtonSize: 44,               // Size in pixels
  customButtonSpacing: 12,            // Space between buttons
  
  // Video Control Features
  playbackSpeed: 1,        // 0.25 - 3.0
  enableLoop: false,       // Loop video
  flipHorizontal: false,   // Mirror/flip video horizontally
  flipVertical: false,     // Flip video vertically
  
  // Video Filters
  videoBrightness: 100,    // 0-200%
  videoContrast: 100,      // 0-200%
  videoSaturation: 100,    // 0-300%
  videoHueRotate: 0,       // 0-360°
  videoBlur: 0,            // 0-10px
  videoSepia: 0,           // 0-100%
  videoGrayscale: 0,       // 0-100%
  videoInvert: 0,          // 0-100%
  videoAberration: 0,      // 0-100%
  
  // Music Metadata Integration
  useSpotify: true,         // Use iTunes API for album art and metadata (free, no auth)
  audioModeEnabled: false,  // Enable audio mode (vinyl/cover + playlist)
  showPlaylist: false,      // Show playlist in audio mode (DISABLED by user request)
};


// 🛠️ FORMATTERS - Time, text utilities


/**
 * Format seconds to HH:MM:SS or MM:SS
 */
function formatTime(s) {
  if (isNaN(s) || s < 0) return '0:00';
  const d = new Date(s * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const sec = d.getUTCSeconds().toString().padStart(2, '0');
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

/**
 * Debounce function calls
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


// 💾 CACHE - Store video metadata (titles & covers)


const CACHE_KEY = 'youtune_video_cache';
const MAX_CACHE_SIZE = 50; // Max 50 videos
const CACHE_EXPIRY_DAYS = 7; // Cache expires after 7 days

/**
 * Get cached video info
 */
function getCachedVideoInfo(videoId) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const cached = cache[videoId];
    
    if (!cached) return null;
    
    // Check if expired
    const now = Date.now();
    const age = now - cached.timestamp;
    const maxAge = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (age > maxAge) {
      console.log(`[Youtune Cache] Expired entry for ${videoId}`);
      deleteCachedVideoInfo(videoId);
      return null;
    }
    
    console.log(`[Youtune Cache] Hit for ${videoId}`);
    return {
      title: cached.title,
      artist: cached.artist,
      thumbnail: cached.thumbnail
    };
  } catch (error) {
    console.error('[Youtune Cache] Error reading cache:', error);
    return null;
  }
}

/**
 * Save video info to cache
 */
function setCachedVideoInfo(videoId, videoInfo) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    
    // Add new entry
    cache[videoId] = {
      title: videoInfo.title,
      artist: videoInfo.artist,
      thumbnail: videoInfo.thumbnail,
      timestamp: Date.now()
    };
    
    // Clean old entries if cache is too large
    const entries = Object.entries(cache);
    if (entries.length > MAX_CACHE_SIZE) {
      console.log(`[Youtune Cache] Cleaning old entries (${entries.length}/${MAX_CACHE_SIZE})`);
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Keep only the most recent MAX_CACHE_SIZE entries
      const recentEntries = entries.slice(-MAX_CACHE_SIZE);
      const newCache = Object.fromEntries(recentEntries);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
      console.log(`[Youtune Cache] Cleaned to ${MAX_CACHE_SIZE} entries`);
    } else {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
    
    console.log(`[Youtune Cache] Saved entry for ${videoId}`);
  } catch (error) {
    console.error('[Youtune Cache] Error writing cache:', error);
    // If localStorage is full, clear old cache
    if (error.name === 'QuotaExceededError') {
      console.log('[Youtune Cache] Storage full, clearing cache');
      clearCache();
    }
  }
}

/**
 * Delete a specific cached entry
 */
function deleteCachedVideoInfo(videoId) {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    delete cache[videoId];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log(`[Youtune Cache] Deleted entry for ${videoId}`);
  } catch (error) {
    console.error('[Youtune Cache] Error deleting cache entry:', error);
  }
}

/**
 * Clear entire cache
 */
function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('[Youtune Cache] Cache cleared');
  } catch (error) {
    console.error('[Youtune Cache] Error clearing cache:', error);
  }
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entries = Object.entries(cache);
    
    return {
      count: entries.length,
      maxSize: MAX_CACHE_SIZE,
      expiryDays: CACHE_EXPIRY_DAYS,
      oldestEntry: entries.length > 0 
        ? new Date(Math.min(...entries.map(e => e[1].timestamp)))
        : null,
      newestEntry: entries.length > 0 
        ? new Date(Math.max(...entries.map(e => e[1].timestamp)))
        : null
    };
  } catch (error) {
    console.error('[Youtune Cache] Error getting stats:', error);
    return { count: 0, maxSize: MAX_CACHE_SIZE, expiryDays: CACHE_EXPIRY_DAYS };
  }
}


// 📦 STATE MANAGEMENT - Global application state


// Active video element
let activeVideo = null;

// Original state storage for restoration
let originalState = {};

// Settings (loaded from chrome.storage)
let settings = { ...defaultSettings };

// UI state
let uiHideTimeout = null;
let ambianceAnimationFrameId = null;
let pageObserver = null;
let isSeeking = false;
let clickTimeout = null;
let interactionOSDTimeout = null;
let volumeOSDTimeout = null;
let skipOSDTimeout = null;
let currentSkipAmount = 0;
let isAmbianceActive = false;
let isInitialLoad = true; // Flag to prevent UI hide on first load
let shouldRestoreCinemaMode = false; // Flag to restore cinema mode after navigation

// Setters (needed because of module scope)
function setActiveVideo(video) {
  activeVideo = video;
}
function setOriginalState(video, state) {
  originalState[video] = state;
}
function setSettings(newSettings) {
  settings = { ...settings, ...newSettings };
}
function setUiHideTimeout(timeout) {
  uiHideTimeout = timeout;
}
function setAmbianceAnimationFrameId(id) {
  ambianceAnimationFrameId = id;
}
function setPageObserver(observer) {
  pageObserver = observer;
}
function setIsSeeking(value) {
  isSeeking = value;
}
function setClickTimeout(timeout) {
  clickTimeout = timeout;
}
function setInteractionOSDTimeout(timeout) {
  interactionOSDTimeout = timeout;
}
function setVolumeOSDTimeout(timeout) {
  volumeOSDTimeout = timeout;
}
function setSkipOSDTimeout(timeout) {
  skipOSDTimeout = timeout;
}
function setCurrentSkipAmount(amount) {
  currentSkipAmount = amount;
}
function setIsAmbianceActive(value) {
  isAmbianceActive = value;
}
function setIsInitialLoad(value) {
  isInitialLoad = value;
}
function setShouldRestoreCinemaMode(value) {
  shouldRestoreCinemaMode = value;
}


// 🎬 VIDEO MANAGER - Find, save, restore videos


/**
 * Find the best video element on the page
 */
function findBestVideo() {
  return Array.from(document.querySelectorAll('video'))
    .filter(v => 
      v.src && 
      v.readyState > 0 && 
      v.getBoundingClientRect().width > 200 && 
      v.offsetHeight > 0
    )
    .sort((a, b) => {
      const aArea = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
      const bArea = b.getBoundingClientRect().width * b.getBoundingClientRect().height;
      return bArea - aArea;
    })[0] || null;
}

/**
 * Save original video state for restoration
 */
function saveOriginalState(video) {
  // Save complete state including individual style properties
  const computedStyle = window.getComputedStyle(video);
  setOriginalState(video, {
    parent: video.parentElement,
    nextSibling: video.nextElementSibling,
    className: video.className,
    // Save individual critical styles that YouTube sets
    styles: {
      position: video.style.position || computedStyle.position,
      top: video.style.top || computedStyle.top,
      left: video.style.left || computedStyle.left,
      width: video.style.width || computedStyle.width,
      height: video.style.height || computedStyle.height,
      transform: video.style.transform || computedStyle.transform,
      objectFit: video.style.objectFit || computedStyle.objectFit,
    }
  });
}

/**
 * Restore video to its original state
 */
function restoreOriginalState(video) {
  const state = originalState[video];
  if (!state) return;
  
  console.log('[Youtune] Restoring video state...');
  
  // Remove custom class
  video.classList.remove('cmu-active-video');
  
  // Restore original class
  video.className = state.className || '';
  
  // Remove ONLY the styles we added, preserve YouTube's styles
  const ourStyles = [
    'borderRadius', 'maxWidth', 'maxHeight', 'boxShadow', 
    'zIndex', 'position', 'objectFit', 'transition', 'opacity'
  ];
  
  ourStyles.forEach(prop => {
    video.style[prop] = '';
  });
  
  // Restore critical YouTube styles if they were saved
  if (state.styles) {
    Object.entries(state.styles).forEach(([prop, value]) => {
      if (value && value !== 'none' && value !== 'auto') {
        video.style[prop] = value;
      }
    });
  }
  
  console.log('[Youtune] Video styles restored intelligently');
  
  // Move video back to original position
  if (state.parent && state.parent.isConnected) {
    try {
      if (state.nextSibling && state.nextSibling.parentNode === state.parent) {
        state.parent.insertBefore(video, state.nextSibling);
        console.log('[Youtune] Video repositioned before sibling');
      } else {
        state.parent.appendChild(video);
        console.log('[Youtune] Video appended to parent');
      }
    } catch (e) {
      console.error('[Youtune] Failed to restore video position:', e);
    }
  }
}

/**
 * Apply video control settings to the active video
 */
function applyVideoSettings(video, settings) {
  if (!video || !settings) return;
  
  // Apply playback speed
  if (settings.playbackSpeed) {
    video.playbackRate = settings.playbackSpeed;
  }
  
  // Apply loop setting
  if (settings.enableLoop !== undefined) {
    video.loop = settings.enableLoop;
  }
}


// ⚙️ SETTINGS MANAGER - Load, save, update







/**
 * Load settings from chrome.storage
 */
function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.sync.get(defaultSettings, items => {
      setSettings(items);
      
      // Check if we need to restore cinema mode after navigation
      const shouldRestore = sessionStorage.getItem('lumen_restore_cinema');
      const wasAudioMode = sessionStorage.getItem('lumen_audio_mode');
      
      if (shouldRestore === 'true') {
        console.log('[Lumen] 🔄 Restoring cinema mode after navigation');
        
        // Clear flags
        sessionStorage.removeItem('lumen_restore_cinema');
        sessionStorage.removeItem('lumen_audio_mode');
        
        // Wait for video to be ready, then restore
        setTimeout(() => {
          if (items.cinemaMode) {
            // Re-enable cinema mode
            const video = document.querySelector('video');
            if (video) {
              import('../core/videoManager.js').then(({ activateCinemaMode }) => {
                activateCinemaMode(video, items);
                
                // Restore audio mode if it was active
                if (wasAudioMode === 'true' && items.audioModeEnabled) {
                  import('../ui/audioMode.js').then(({ toggleAudioMode }) => {
                    setTimeout(() => toggleAudioMode(true), 500);
                  });
                }
              });
            }
          }
        }, 1000);
      }
      
      resolve();
    });
  });
}

/**
 * Update a single setting
 */
function updateSetting(key, value) {
  if (typeof defaultSettings[key] === 'boolean') {
    value = !!value;
  } else if (typeof defaultSettings[key] === 'number') {
    value = parseFloat(value);
  }
  
  const newSettings = { ...settings, [key]: value };
  setSettings(newSettings);
  
  chrome.storage.sync.set({ [key]: value });
  applyDynamicStyles();
  updateUiState();
  
  // Special handling for audio mode cover type - update immediately
  if (key === 'audioCoverType') {
    updateCoverType(value);
  }
}

/**
 * Update multiple settings at once (batch update)
 */
function updateMultipleSettings(updates) {
  const processedUpdates = {};
  
  for (const [key, value] of Object.entries(updates)) {
    if (typeof defaultSettings[key] === 'boolean') {
      processedUpdates[key] = !!value;
    } else if (typeof defaultSettings[key] === 'number') {
      processedUpdates[key] = parseFloat(value);
    } else {
      processedUpdates[key] = value;
    }
  }
  
  const newSettings = { ...settings, ...processedUpdates };
  setSettings(newSettings);
  
  chrome.storage.sync.set(processedUpdates);
  applyDynamicStyles();
  updateUiState();
}

/**
 * Restore all settings to defaults
 */
function restoreDefaultSettings() {
  chrome.storage.sync.set(defaultSettings, () => {
    loadSettings().then(() => {
      applyDynamicStyles();
      populateSettingsPanel();
      updateUiState();
      setIsAmbianceActive(settings.ambianceEnabled);
      if (isAmbianceActive) {
        startAmbiance();
      } else {
        stopAmbiance();
      }
    });
  });
}

/**
 * Get the appropriate theme for current time (for Auto theme)
 * Morning (6-12): Light
 * Afternoon (12-18): Sunset
 * Evening (18-22): Dark
 * Night (22-6): Midnight
 */
function getAutoThemeForTime() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'light';
  } else if (hour >= 12 && hour < 18) {
    return 'sunset';
  } else if (hour >= 18 && hour < 22) {
    return 'dark';
  } else {
    return 'midnight';
  }
}

/**
 * Apply auto theme based on time of day
 */
function applyAutoTheme() {
  const targetTheme = getAutoThemeForTime();
  // Don't change the actual uiTheme setting, just apply the theme temporarily
  // This way, if user disables auto, they return to their chosen theme
  return targetTheme;
}


// 🎵 MUSIC METADATA INTEGRATION

// Utilise iTunes API (Apple Music) pour les pochettes d'album
// Gratuit, sans authentification, fiable

const ITUNES_API_BASE = 'https://itunes.apple.com/search';

/**
 * Vérifie si l'intégration musique est activée
 * @returns {Promise<boolean>}
 */
async function isSpotifyConnected() {
  // iTunes API est toujours disponible, pas besoin de connexion
  return settings.useSpotify;
}

/**
 * Recherche une chanson sur iTunes API (Apple Music)
 * @param {string} artist - Nom de l'artiste
 * @param {string} title - Titre de la chanson
 * @returns {Promise<object|null>} Données de la chanson ou null
 */
async function searchMusicTrack(artist, title) {
  if (!settings.useSpotify) {
    console.log('[Lumen/Music] Integration disabled in settings');
    return null;
  }
  
  try {
    // Clean up artist/title (remove featuring, parentheses, etc.)
    const cleanArtist = artist.replace(/\s*\(.*?\)\s*/g, '').trim();
    const cleanTitle = title.replace(/\s*[\(\[].*?[\)\]]\s*/g, '').trim();
    
    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const response = await fetch(
      `${ITUNES_API_BASE}?term=${query}&entity=song&limit=1`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      console.log('[Lumen/Music] Search failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.results?.length > 0) {
      const track = data.results[0];
      console.log('[Lumen/Music] ✅ Found:', track.trackName, '-', track.artistName);
      return track;
    }
    
    console.log('[Lumen/Music] No results found for:', cleanArtist, '-', cleanTitle);
    return null;
    
  } catch (error) {
    console.error('[Lumen/Music] Search error:', error);
    return null;
  }
}

/**
 * Récupère la pochette d'album depuis iTunes/Apple Music
 * @param {string} artist - Nom de l'artiste
 * @param {string} title - Titre de la chanson
 * @returns {Promise<string|null>} URL de la pochette (haute qualité) ou null
 */
async function getSpotifyAlbumArt(artist, title) {
  const track = await searchMusicTrack(artist, title);
  
  if (track?.artworkUrl100) {
    // iTunes fournit artworkUrl100 (100x100), on le remplace par 600x600
    const albumArt = track.artworkUrl100.replace('100x100bb', '600x600bb');
    console.log('[Lumen/Music] 🎨 Album art (600x600):', albumArt);
    return albumArt;
  }
  
  return null;
}

/**
 * Récupère les métadonnées complètes depuis iTunes
 * @param {string} artist - Nom de l'artiste
 * @param {string} title - Titre de la chanson
 * @returns {Promise<object|null>} { title, artist, album, albumArt, releaseDate }
 */
async function getSpotifyMetadata(artist, title) {
  const track = await searchMusicTrack(artist, title);
  
  if (!track) return null;
  
  return {
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    albumArt: track.artworkUrl100?.replace('100x100bb', '600x600bb') || null,
    releaseDate: track.releaseDate,
    duration: track.trackTimeMillis,
    previewUrl: track.previewUrl
  };
}


// ✨ AMBIANCE EFFECT - Canvas rendering





/**
 * Start ambiance effect rendering
 */
function startAmbiance() {
  if (!activeVideo || ambianceAnimationFrameId) return;
  
  const canvas = document.getElementById(AMBIANCE_ID);
  if (!canvas) return;
  
  const context = canvas.getContext('2d', { 
    willReadFrequently: false,
    alpha: false,
    desynchronized: true
  });
  
  let frameCount = 0;
  let lastWidth = 0;
  let lastHeight = 0;
  
  function renderAmbiance() {
    if (!isAmbianceActive || !activeVideo || !activeVideo.isConnected) {
      return stopAmbiance();
    }
    
    // Performance: Skip every other frame (30fps instead of 60fps)
    frameCount++;
    if (frameCount % 2 !== 0) {
      setAmbianceAnimationFrameId(requestAnimationFrame(renderAmbiance));
      return;
    }
    
    if (activeVideo.videoWidth > 0) {
      // Performance: Reduced canvas size for better performance
      const targetWidth = 150;
      const targetHeight = Math.floor(targetWidth * (activeVideo.videoHeight / activeVideo.videoWidth));
      
      // Only resize canvas if dimensions changed
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        lastWidth = targetWidth;
        lastHeight = targetHeight;
      }
      
      try {
        context.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error('Failed to draw video frame:', e);
      }
    }
    
    setAmbianceAnimationFrameId(requestAnimationFrame(renderAmbiance));
  }
  
  renderAmbiance();
}

/**
 * Stop ambiance effect rendering
 */
function stopAmbiance() {
  if (ambianceAnimationFrameId) {
    cancelAnimationFrame(ambianceAnimationFrameId);
  }
  setAmbianceAnimationFrameId(null);
  
  const canvas = document.getElementById(AMBIANCE_ID);
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Free memory by resetting canvas size
    canvas.width = 1;
    canvas.height = 1;
  }
}

/**
 * Toggle ambiance effect on/off
 */
function toggleAmbiance() {
  const newValue = !isAmbianceActive;
  setIsAmbianceActive(newValue);
  updateSetting('ambianceEnabled', newValue);
  
  if (newValue) {
    startAmbiance();
  } else {
    stopAmbiance();
  }
  
  updateUiState();
}


// 🎨 STYLES - Dynamic CSS Variables




/**
 * Injects a <link> tag for the static CSS and a <style> tag for dynamic variables.
 */
function injectStyles() {
  // Inject static CSS from main.css via a <link> tag for better performance
  if (!document.getElementById('cmu-static-styles')) {
    const staticStyleEl = document.createElement('link');
    staticStyleEl.id = 'cmu-static-styles';
    staticStyleEl.rel = 'stylesheet';
    staticStyleEl.href = chrome.runtime.getURL('modules/effects/main.css');
    document.head.appendChild(staticStyleEl);
  }

  // Ensure dynamic style tag exists for CSS variables
  if (!document.getElementById(STYLES_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLES_ID;
    document.head.appendChild(styleEl);
  }
}

/**
 * Extracts the accent color from a theme.
 */
function extractAccentColor(theme) {
  if (settings.uiTheme === 'custom') {
    return `hsl(${settings.customHue || 200}, 70%, 50%)`;
  }
  const match = theme.progressShadow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return match ? `rgb(${match[1]}, ${match[2]}, ${match[3]})` : '#007AFF';
}

/**
 * Generate Glassmorphism CSS properties based on theme settings.
 * Combines iOS crystalline, macOS Big Sur, and Windows 11 Acrylic effects.
 * 
 * @param {Object} glassmorphism - Glassmorphism settings from theme
 * @param {boolean} isDark - Whether the theme is dark
 * @returns {string} CSS properties string
 */
function generateGlassmorphismCSS(glassmorphism, isDark) {
  if (!glassmorphism || !glassmorphism.enabled) {
    return '';
  }

  const {
    backgroundOpacity = 0.1,
    backdropBlur = 40,
    backdropSaturate = 180,
    backdropBrightness = 100,
    borderOpacity = 0.2,
    shadowIntensity = 0.37,
    blendMode = 'overlay'
  } = glassmorphism;

  // Base color: white for light themes, black for dark themes
  const baseColor = isDark ? '0, 0, 0' : '255, 255, 255';
  const borderColor = isDark ? '255, 255, 255' : '255, 255, 255';
  const shadowColor = isDark ? '0, 0, 0' : '0, 0, 0';

  return `
    background: rgba(${baseColor}, ${backgroundOpacity});
    backdrop-filter: blur(${backdropBlur}px) saturate(${backdropSaturate}%) brightness(${backdropBrightness}%);
    -webkit-backdrop-filter: blur(${backdropBlur}px) saturate(${backdropSaturate}%) brightness(${backdropBrightness}%);
    background-blend-mode: ${blendMode};
    border: 1px solid rgba(${borderColor}, ${borderOpacity});
    box-shadow: 0 8px 32px rgba(${shadowColor}, ${shadowIntensity});
  `.trim();
}

/**
 * Applies dynamic styles by updating CSS variables in the dedicated <style> tag.
 */
function applyDynamicStyles() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  const isFullscreen = !!document.fullscreenElement;
  const {
    videoBorderRadius, ambianceBlur, ambianceOpacity, ambianceSaturation, ambianceHue,
    videoShadowBlur, videoShadowOpacity, videoShadowX, videoShadowY, ambianceEnabled,
    customHue, 
    // Custom Theme Engine properties (aligned with preset themes)
    customMenuOpacity, customMenuBlur, customMenuSaturation, customMenuBrightness, customMenuContrast, customMenuBorderOpacity,
    customMenuTextLightness, customMenuHeadingLightness,
    customControlBarOpacity, customControlBarBlur, customControlBarSaturation, 
    customControlBarBrightness, customControlBarContrast, 
    customControlBarStyle, customControlBarWidth, customControlBarHeight, customControlBarPadding,
    showControlBarBg, showCapsuleBorder,
    buttonShape, customButtonSize, customButtonSpacing, customButtonBgOpacity, customButtonBorderOpacity, 
    customButtonHoverBgOpacity, customButtonTextLightness,
    uiTheme: currentThemeName
  } = settings;

  const effectiveThemeName = currentThemeName === 'auto' ? getAutoThemeForTime() : currentThemeName;
  const uiTheme = UI_THEMES[effectiveThemeName] || UI_THEMES.dark;
  const isCustomTheme = currentThemeName === 'custom';
  const themeValues = uiTheme.values || {};

  // --- Prepare CSS variables ---
  const variables = {};

  // Theme & Accent Colors
  // Pour Custom Theme: utilise customHue
  // Pour autres thèmes: utilise themeValues.hue
  const effectiveHue = isCustomTheme ? customHue : (themeValues.hue || 200);
  variables['--cmu-custom-hue'] = effectiveHue;
  
  const accentColor = extractAccentColor(uiTheme);
  variables['--cmu-accent-color'] = accentColor;
  variables['--cmu-accent-color-hover'] = isCustomTheme ? `hsl(${customHue || 200}, 80%, 60%)` : accentColor;

  // RGB Gaming theme initialization
  if (effectiveThemeName === 'rgbGaming') {
    initRGBTheme();
  }

  // Text Colors - UNIFIED: même logique pour tous les thèmes
  variables['--cmu-text-primary'] = `hsl(0, 0%, ${isCustomTheme ? customMenuTextLightness : themeValues.menuTextLightness}%)`;
  variables['--cmu-text-button'] = `hsl(0, 0%, ${isCustomTheme ? customButtonTextLightness : themeValues.buttonTextLightness}%)`;
  variables['--cmu-text-heading'] = `hsl(0, 0%, ${isCustomTheme ? customMenuHeadingLightness : themeValues.menuHeadingLightness}%)`;
  variables['--cmu-text-secondary'] = `hsl(0, 0%, ${Math.min(isCustomTheme ? customMenuTextLightness : themeValues.menuTextLightness, 90)}%)`;

  // Backgrounds
  const bgColor = uiTheme.isDark === false ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
  const bgGradientColor = uiTheme.isDark === false 
    ? 'linear-gradient(135deg, rgb(255,255,255) 0%, rgb(245,245,250) 100%)' 
    : 'linear-gradient(135deg, rgb(0,0,0) 0%, rgb(10,10,15) 100%)';
  
  variables['--cmu-bg-primary'] = ambianceEnabled ? (uiTheme.isDark === false ? 'rgb(240,240,245)' : 'transparent') : bgColor;
  variables['--cmu-bg-gradient'] = ambianceEnabled ? bgGradientColor : bgColor;

  // Menu & Panels - UNIFIED: même logique pour tous les thèmes
  const menuOpacity = isCustomTheme ? customMenuOpacity : themeValues.menuOpacity;
  const menuBlur = isCustomTheme ? customMenuBlur : themeValues.menuBlur;
  const menuSaturation = isCustomTheme ? customMenuSaturation : themeValues.menuSaturation;
  const menuBrightness = isCustomTheme ? customMenuBrightness : themeValues.menuBrightness;
  const menuContrast = isCustomTheme ? customMenuContrast : themeValues.menuContrast;
  const menuBorderOpacity = isCustomTheme ? customMenuBorderOpacity : themeValues.menuBorderOpacity;
  
  // Menu Background: Custom Theme utilise HSL basé sur hue, autres thèmes peuvent avoir couleur exacte
  variables['--cmu-menu-bg'] = isCustomTheme
    ? `hsla(${effectiveHue}, 20%, 18%, ${menuOpacity})`
    : (themeValues.menuBg || `rgba(28, 28, 30, ${menuOpacity})`);
  variables['--cmu-menu-border-color'] = isCustomTheme
    ? `hsla(${effectiveHue}, 70%, 50%, ${menuBorderOpacity})`
    : (themeValues.menuBorder || `rgba(255, 255, 255, ${menuBorderOpacity})`);
  variables['--cmu-menu-backdrop-filter'] = `blur(${menuBlur}px) saturate(${menuSaturation}%) brightness(${menuBrightness}%) contrast(${menuContrast}%)`;

  // Control Bar - UNIFIED avec support des styles custom
  const controlBarOpacity = isCustomTheme ? customControlBarOpacity : themeValues.controlBarOpacity;
  const controlBarBlur = isCustomTheme ? customControlBarBlur : themeValues.controlBarBlur;
  const controlBarSaturation = isCustomTheme ? customControlBarSaturation : themeValues.controlBarSaturation;
  const controlBarBrightness = isCustomTheme ? customControlBarBrightness : themeValues.controlBarBrightness;
  const controlBarContrast = isCustomTheme ? customControlBarContrast : themeValues.controlBarContrast;
  
  // Control Bar Background basé sur le mode (custom theme only)
  if (isCustomTheme) {
    if (customControlBarStyle === 'normal') {
      // Mode Normal: Background toggle ON/OFF
      variables['--cmu-control-bar-bg'] = showControlBarBg
        ? `linear-gradient(to top, hsla(${effectiveHue}, 20%, 20%, ${controlBarOpacity}) 0%, hsla(${effectiveHue}, 20%, 30%, ${controlBarOpacity * 0.8}) 50%, transparent 100%)`
        : 'transparent';
    } else if (customControlBarStyle === 'gradient') {
      // Mode Gradient: Toujours actif, gradient automatique
      variables['--cmu-control-bar-bg'] = `linear-gradient(to top, hsla(${effectiveHue}, 60%, 40%, ${controlBarOpacity}) 0%, hsla(${effectiveHue}, 50%, 50%, ${controlBarOpacity * 0.6}) 50%, transparent 100%)`;
    } else if (customControlBarStyle === 'capsule') {
      // Mode Capsule: Border toggle (si OFF, arrière-plan transparent mais forme capsule conservée)
      variables['--cmu-control-bar-bg'] = showCapsuleBorder
        ? `hsla(${effectiveHue}, 20%, 20%, ${controlBarOpacity})`
        : 'transparent';
      // Capsule dimensions
      variables['--cmu-control-bar-width'] = `${customControlBarWidth}%`;
      variables['--cmu-control-bar-height'] = `${customControlBarHeight}px`;
      variables['--cmu-control-bar-padding'] = `${customControlBarPadding}px`;
      variables['--cmu-control-bar-border-radius'] = '40px';
    }
  } else {
    // Preset themes: use theme values
    const shouldHideControlBar = themeValues.hideControlBar || false;
    variables['--cmu-control-bar-bg'] = shouldHideControlBar ? 'transparent' 
      : (themeValues.controlBarGradient || `linear-gradient(to top, rgba(28,28,30,${controlBarOpacity}) 0%, transparent 100%)`);
  }
  
  variables['--cmu-control-bar-backdrop-filter'] = `blur(${controlBarBlur}px) saturate(${controlBarSaturation}%) brightness(${controlBarBrightness}%) contrast(${controlBarContrast}%)`;

  // Buttons - UNIFIED: même logique pour tous les thèmes
  const buttonBgOpacity = isCustomTheme ? customButtonBgOpacity : themeValues.buttonBgOpacity;
  const buttonBorderOpacity = isCustomTheme ? customButtonBorderOpacity : themeValues.buttonBorderOpacity;
  const buttonHoverBgOpacity = isCustomTheme ? customButtonHoverBgOpacity : themeValues.buttonHoverBgOpacity;
  
  variables['--cmu-button-bg'] = isCustomTheme
    ? `hsla(${effectiveHue}, 70%, 50%, ${buttonBgOpacity})`
    : (themeValues.controlButtonBg || `rgba(255, 255, 255, ${buttonBgOpacity})`);
  variables['--cmu-button-border-color'] = isCustomTheme
    ? `hsla(${effectiveHue}, 70%, 50%, ${buttonBorderOpacity})`
    : (themeValues.controlButtonBorder || `rgba(255, 255, 255, ${buttonBorderOpacity})`);
  variables['--cmu-button-hover-bg'] = isCustomTheme
    ? `hsla(${effectiveHue}, 70%, 50%, ${buttonHoverBgOpacity})`
    : (themeValues.controlButtonHoverBg || `rgba(255, 255, 255, ${buttonHoverBgOpacity})`);
  
  // Button Shape (utilisé par tous les thèmes)
  const effectiveButtonShape = isCustomTheme ? buttonShape : (themeValues.buttonShape || 'circle');
  variables['--cmu-button-shape'] = effectiveButtonShape === 'circle' ? '50%' : '10px';
  
  // Button Size and Spacing (custom theme only, pour plus de contrôle)
  variables['--cmu-button-size'] = isCustomTheme ? `${customButtonSize}px` : '44px';
  variables['--cmu-button-spacing'] = isCustomTheme ? `${customButtonSpacing}px` : '12px';

  // Progress & Sliders
  const progressHue = effectiveHue;
  variables['--cmu-progress-gradient'] = isCustomTheme
    ? `linear-gradient(90deg, hsl(${progressHue}, 75%, 55%) 0%, hsl(${(progressHue + 120) % 360}, 80%, 58%) 50%, hsl(${(progressHue + 240) % 360}, 75%, 55%) 100%)`
    : uiTheme.progressGradient;
  variables['--cmu-progress-shadow'] = isCustomTheme
    ? `hsla(${(progressHue + 120) % 360}, 80%, 58%, 0.7)`
    : uiTheme.progressShadow;
  variables['--cmu-slider-track-color'] = isCustomTheme
    ? `hsla(${progressHue}, 25%, 40%, 0.35)`
    : (uiTheme.isDark === false ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)');
  variables['--cmu-slider-thumb-color'] = uiTheme.isDark === false ? '#111111' : '#ffffff';

  // Video
  variables['--cmu-video-border-radius'] = `${videoBorderRadius}px`;
  variables['--cmu-video-shadow'] = `${videoShadowX}px ${videoShadowY}px ${videoShadowBlur}px rgba(0,0,0,${videoShadowOpacity})`;
  
  // Ambiance
  variables['--cmu-ambiance-filter'] = `blur(${ambianceBlur}px) saturate(${ambianceSaturation}) brightness(1.2) hue-rotate(${ambianceHue}deg)`;
  variables['--cmu-ambiance-opacity'] = ambianceOpacity;

  // Glassmorphism - Generate CSS properties if enabled
  if (uiTheme.glassmorphism && uiTheme.glassmorphism.enabled) {
    const glassCSS = generateGlassmorphismCSS(uiTheme.glassmorphism, uiTheme.isDark);
    // Parse the generated CSS into individual variables
    const glassProps = glassCSS.split(';').reduce((acc, prop) => {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    
    // Store glassmorphism properties as CSS variables
    variables['--cmu-glass-background'] = glassProps['background'] || '';
    variables['--cmu-glass-backdrop-filter'] = glassProps['backdrop-filter'] || '';
    variables['--cmu-glass-blend-mode'] = glassProps['background-blend-mode'] || 'normal';
    variables['--cmu-glass-border'] = glassProps['border'] || '';
    variables['--cmu-glass-shadow'] = glassProps['box-shadow'] || '';
  } else {
    // Fallback to empty values if glassmorphism is disabled
    variables['--cmu-glass-background'] = '';
    variables['--cmu-glass-backdrop-filter'] = '';
    variables['--cmu-glass-blend-mode'] = 'normal';
    variables['--cmu-glass-border'] = '';
    variables['--cmu-glass-shadow'] = '';
  }

  // --- Generate and inject the CSS variable definitions ---
  const styleEl = document.getElementById(STYLES_ID);
  if (styleEl) {
    const cssText = `:root {
      ${Object.entries(variables).map(([key, value]) => `${key}: ${value};`).join('\n      ')}
    }`;
    styleEl.textContent = cssText;
    
    // DEBUG: Log custom theme updates
    if (isCustomTheme) {
      console.log('🎨 Custom Theme Update:', {
        customHue,
        menuOpacity, menuBlur, menuSaturation,
        controlBarOpacity, controlBarStyle: customControlBarStyle,
        hideControlBarBg: shouldHideControlBar,
        capsuleHeight: customControlBarHeight,
        capsulePadding: customControlBarPadding,
        buttonShape: effectiveButtonShape
      });
    }
  } else {
    console.error('❌ STYLES_ID element not found! CSS not applied.');
  }

  // --- Directly update elements that can't be purely CSS-driven ---
  if (activeVideo) {
    const targetVideoMaxSize = isFullscreen ? 85 : settings.videoMaxSize;
    activeVideo.style.maxWidth = `${targetVideoMaxSize}vw`;
    activeVideo.style.maxHeight = `${targetVideoMaxSize}vh`;
  }
  
  const ambianceCanvas = document.getElementById('cmu-ambiance-canvas');
  if (ambianceCanvas) {
    ambianceCanvas.style.display = ambianceEnabled ? 'block' : 'none';
  }

  const settingsPanel = document.getElementById('cmu-settings-panel');
  const videoSizeSlider = settingsPanel?.querySelector('input[data-key="videoMaxSize"]');
  if (videoSizeSlider) {
    videoSizeSlider.disabled = isFullscreen;
    const valueDisplay = videoSizeSlider.closest('.cmu-slider-container').querySelector('.cmu-slider-value');
    if (valueDisplay) {
      valueDisplay.textContent = isFullscreen ? 'N/A' : `${settings.videoMaxSize}%`;
    }
  }
}

/**
 * Start RGB Gaming animation
 */
function startRGBAnimation() {
  // Only start if RGB theme is active
  if (settings.uiTheme !== 'rgbGaming') return;
  
  let hue = 0;
  const rgbInterval = setInterval(() => {
    if (settings.uiTheme !== 'rgbGaming') {
      clearInterval(rgbInterval);
      return;
    }
    
    hue = (hue + 2) % 360; // Change color every frame
    document.documentElement.style.setProperty('--rgb-hue', hue);
  }, 50); // 20 FPS for smooth animation
}

/**
 * Initialize RGB theme variables
 */
function initRGBTheme() {
  if (settings.uiTheme === 'rgbGaming') {
    document.documentElement.style.setProperty('--rgb-hue', '0');
    startRGBAnimation();
  }
}



// 🎨 AUDIO MODE STYLES - Pochette/Vinyl CSS


/**
 * Generate CSS for Audio Mode (vinyl, cover, playlist)
 */
function generateAudioModeStyles(settings) {
  const isVinyl = settings.audioCoverType === 'vinyl';
  
  return `
    /* ========================================
       🎵 AUDIO MODE CONTAINER
       ======================================== */
    #cmu-audio-mode-container {
      animation: audioModeSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes audioModeSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* ========================================
       💿 VINYL DISC (Spinning)
       ======================================== */
    .cmu-vinyl-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
    }
    
    .cmu-vinyl-disc {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      background: 
        radial-gradient(circle at center, #1a1a1a 0%, #000 50%, #1a1a1a 100%);
      animation: vinylSpin 8s linear infinite;
      box-shadow: 
        inset 0 0 40px rgba(0,0,0,0.5),
        0 10px 30px rgba(0,0,0,0.4);
    }
    
    .cmu-vinyl-disc.paused {
      animation-play-state: paused !important;
    }
    
    @keyframes vinylSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .cmu-vinyl-cover {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 45%;
      height: 45%;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      z-index: 2;
    }
    
    .cmu-vinyl-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 12%;
      height: 12%;
      border-radius: 50%;
      background: radial-gradient(circle, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
      box-shadow: 
        0 0 8px rgba(0,0,0,0.6),
        inset 0 2px 5px rgba(255,255,255,0.1);
      z-index: 3;
    }
    
    .cmu-vinyl-grooves {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: 
        repeating-radial-gradient(
          circle at center,
          transparent 0px,
          transparent 2px,
          rgba(255,255,255,0.03) 2px,
          rgba(255,255,255,0.03) 3px
        );
      pointer-events: none;
      z-index: 1;
    }
    
    /* ========================================
       🖼️ ALBUM COVER (Static)
       ======================================== */
    .cmu-album-cover {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 20px !important;
      overflow: hidden !important;
      box-shadow: 
        0 30px 80px rgba(0,0,0,0.6),
        0 15px 40px rgba(0,0,0,0.5),
        0 5px 15px rgba(0,0,0,0.4);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
    }
    
    .cmu-album-cover:hover {
      transform: scale(1.02) translateY(-3px);
      box-shadow: 
        0 35px 95px rgba(0,0,0,0.7),
        0 20px 55px rgba(0,0,0,0.6),
        0 8px 20px rgba(0,0,0,0.5);
    }
    
    .cmu-album-cover img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block;
      border-radius: 20px !important;
    }
    
    .cmu-cover-reflection {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(
        to top,
        rgba(0,0,0,0.3) 0%,
        transparent 100%
      );
      pointer-events: none;
    }
  `;
}


// 🎮 UI CONTROLS - Controls, settings panel, OSD






/**
 * Create main controls UI
 */
function createControls() {
  const c = document.createElement('div');
  c.id = CONTROLS_ID;
  const isYouTube = window.location.hostname.includes('youtube.com');

  c.innerHTML = `
    <div class="cmu-progress-bar-container" role="progressbar" aria-label="Video progress"><div class="cmu-progress-bar"><div class="cmu-progress-played"></div></div></div>
    <div class="cmu-bottom-controls">
      <div class="cmu-left-controls">
        ${isYouTube ? `<button class="cmu-control-button cmu-prev-track-btn" title="Previous video (Shift+P)" aria-label="Previous video">${ICONS.prevTrack}</button>` : ''}
        <button class="cmu-control-button cmu-play-pause-btn" aria-label="Play/Pause">${ICONS.play}</button>
        ${isYouTube ? `<button class="cmu-control-button cmu-next-track-btn" title="Next video (Shift+N)" aria-label="Next video">${ICONS.nextTrack}</button>` : ''}
        <div class="cmu-volume-container">
          <button class="cmu-control-button cmu-volume-btn" aria-label="Toggle mute">${ICONS.volumeHigh}</button>
          <input type="range" class="cmu-volume-slider" min="0" max="1" step="0.01" aria-label="Volume slider">
        </div>
        <span class="cmu-time-display" role="timer" aria-live="off">0:00 / 0:00</span>
      </div>
      <div class="cmu-right-controls">
        <button class="cmu-control-button cmu-audio-mode-btn" title="Audio Mode (L)" aria-label="Toggle audio mode" aria-pressed="false">${ICONS.audioMode}</button>
        <button class="cmu-control-button cmu-ambiance-btn" title="Ambiance (A)" aria-label="Toggle ambiance effect" aria-pressed="false">${ICONS.ambianceOff}</button>
        <button class="cmu-control-button cmu-settings-btn" title="Settings" aria-label="Open settings panel" aria-expanded="false">${ICONS.settings}</button>
        <button class="cmu-control-button cmu-fullscreen-btn" title="Fullscreen (F)" aria-label="Toggle fullscreen">${ICONS.fullscreen}</button>
        <button class="cmu-control-button cmu-exit-btn" title="Exit (Esc)" aria-label="Exit cinema mode">${ICONS.close}</button>
      </div>
    </div>`;
  return c;
}

/**
 * Create shorts-specific controls
 */
function createShortsControls() {
  const c = document.createElement('div');
  c.id = SHORTS_CONTROLS_ID;
  c.innerHTML = `
    <button class="cmu-control-button cmu-ambiance-btn" title="Ambiance (A)" aria-label="Toggle ambiance effect" aria-pressed="false">${ICONS.ambianceOff}</button>
    <button class="cmu-control-button cmu-exit-btn" title="Exit (Esc)" aria-label="Exit cinema mode">${ICONS.close}</button>
  `;
  return c;
}

function createSectionHeader(title, sectionKey, options = {}) {
  const { icon = '', hideReset = false } = options;
  const label = icon ? `${icon} ${title}` : title;
  const resetMarkup = hideReset
    ? ''
    : `<button type="button" class="cmu-section-reset-btn" data-section="${sectionKey}" aria-label="Réinitialiser ${title}">↺ Reset</button>`;

  return `<div class="cmu-section-header" data-section="${sectionKey}">
    <h4>${label}</h4>
    ${resetMarkup}
  </div>`;
}

/**
 * Create settings panel UI
 */
function createSettingsPanel() {
  const p = document.createElement('div');
  p.id = SETTINGS_ID;
  p.setAttribute('role', 'dialog');
  p.setAttribute('aria-label', 'Settings panel');
  p.innerHTML = `
    <div class="cmu-settings-header">
      <h3>🎬 Youtune 1.0</h3>
      <button class="cmu-close-settings-btn" aria-label="Close settings">${ICONS.close}</button>
    </div>
    <div class="cmu-tabs-container">
      <div class="cmu-tabs">
        <button class="cmu-tab active" data-tab="themes">🎨 Themes</button>
        <button class="cmu-tab" data-tab="appearance">👁️ Appearance</button>
        <button class="cmu-tab" data-tab="video">🎮 Video</button>
        <button class="cmu-tab" data-tab="settings">⚙️ Settings</button>
      </div>
    </div>
    <div class="cmu-settings-content">
      <!-- TAB 1: THEMES -->
      <div class="cmu-tab-content active" data-tab-content="themes">
        ${Object.entries(THEME_CATEGORIES).map(([categoryKey, category]) => `
          <div class="cmu-theme-category">
            <h4>${category.icon} ${category.name}</h4>
            <div class="cmu-theme-bar-container">
              ${Object.entries(UI_THEMES)
                .filter(([, theme]) => theme.category === categoryKey)
                .map(([key, theme]) => `
                  <button class="cmu-theme-bar-btn" data-theme="${key}" aria-label="${theme.name}">
                    <span class="theme-bar-icon">${theme.icon}</span>
                    <span class="theme-bar-name">${theme.name}</span>
                  </button>
                `).join('')}
            </div>
          </div>
        `).join('')}
        
        <!-- Special Themes: Auto & Random -->
        <div class="cmu-theme-category">
          <h4>✨ Thèmes Spéciaux</h4>
          <div class="cmu-theme-bar-container">
            <button class="cmu-theme-bar-btn" data-theme="auto" aria-label="Auto (Time-based)">
              <span class="theme-bar-icon">🕐</span>
              <span class="theme-bar-name">Auto</span>
            </button>
            <button class="cmu-theme-bar-btn" data-theme="random" aria-label="Random Theme">
              <span class="theme-bar-icon">🎲</span>
              <span class="theme-bar-name">Random</span>
            </button>
          </div>
          <p style="font-size: 11px; opacity: 0.6; margin: 8px 0 0 0; padding: 0 4px;">
            <strong>Auto:</strong> Change automatiquement selon l'heure • 
            <strong>Random:</strong> Génère un nouveau thème à chaque clic
          </p>
        </div>
        
        <div id="custom-theme-container" style="display: none;">
          ${createSectionHeader('Custom Theme Engine', 'custom-theme', { icon: '🎨' })}
          <p style="font-size: 11px; opacity: 0.7; margin: 0 0 16px 0; padding: 0 8px; line-height: 1.5;">
            Personnalisez l'apparence du <strong>Menu</strong> (ce panneau) et de la <strong>Barre de Contrôle</strong> (lecteur vidéo).
          </p>
          
          <!-- SECTION 1: MENU (Settings Panel) -->
          <div class="cmu-subsection">
            <h5>📋 Menu (Panneau de Paramètres)</h5>
            ${createSlider('customHue', 'Couleur (Hue)', 0, 360, '°', 1)}
            ${createSlider('customMenuOpacity', 'Opacité (0 = transparent)', 0, 1, '', 0.05)}
            ${createSlider('customMenuBlur', 'Flou (Blur)', 0, 100, 'px')}
            ${createSlider('customMenuSaturation', 'Saturation', 0, 300, '%', 10)}
            ${createSlider('customMenuBrightness', 'Luminosité (Brightness)', 50, 150, '%', 5)}
            ${createSlider('customMenuContrast', 'Contraste', 50, 200, '%', 5)}
            ${createSlider('customMenuBorderOpacity', 'Bordure (Border)', 0, 1, '', 0.05)}
            <div class="cmu-slider-container">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="display: flex; align-items: center; gap: 4px;">
                  Titres (Heading)
                  <span style="cursor: help; opacity: 0.6;" title="Luminosité des titres de sections (📋, 🎮, etc.)">ⓘ</span>
                </label>
                <span class="cmu-slider-value"></span>
              </div>
              <input type="range" data-key="customMenuHeadingLightness" min="0" max="100" step="5" value="90">
            </div>
          </div>
          
          <!-- SECTION 2: BARRE DE CONTRÔLE -->
          <div class="cmu-subsection">
            <h5>🎮 Barre de Contrôle (Player)</h5>
            
            <!-- Style Selector -->
            <div class="cmu-setting-item" style="margin-bottom: 16px;">
              <label style="font-weight: 500; margin-bottom: 8px; display: block;">Mode d'Affichage</label>
              <div class="cmu-control-bar-styles">
                <button class="cmu-bar-style-btn active" data-bar-style="normal">
                  <span>━━━━</span>
                  <div>Normal</div>
                </button>
                <button class="cmu-bar-style-btn" data-bar-style="gradient">
                  <span>▀▀▀▀</span>
                  <div>Gradient</div>
                </button>
                <button class="cmu-bar-style-btn" data-bar-style="capsule">
                  <span>◖━━◗</span>
                  <div>Capsule</div>
                </button>
              </div>
            </div>
            
            <!-- Mode Normal: Background Toggle -->
            <div id="normal-mode-settings" style="display: block;">
              <div class="cmu-setting-item" style="margin-bottom: 12px;">
                <label for="control-bar-bg-toggle">
                  Arrière-plan
                  <span style="font-size: 10px; opacity: 0.6; display: block;">Activer l'arrière-plan customisable</span>
                </label>
                <label class="cmu-switch">
                  <input type="checkbox" id="control-bar-bg-toggle" data-key="showControlBarBg" checked aria-label="Show control bar background">
                  <span class="cmu-slider-switch"></span>
                </label>
              </div>
            </div>
            
            <!-- Mode Gradient: Info Text -->
            <div id="gradient-mode-settings" style="display: none;">
              <p style="font-size: 11px; opacity: 0.6; margin: 0 0 12px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                ℹ️ Le gradient s'applique automatiquement du bas (opaque) vers le haut (transparent).
              </p>
            </div>
            
            <!-- Mode Capsule: Border Toggle + Width -->
            <div id="capsule-mode-settings" style="display: none;">
              <div class="cmu-setting-item" style="margin-bottom: 12px;">
                <label for="capsule-border-toggle">
                  Bordure (Border)
                  <span style="font-size: 10px; opacity: 0.6; display: block;">Activer la bordure de la capsule</span>
                </label>
                <label class="cmu-switch">
                  <input type="checkbox" id="capsule-border-toggle" data-key="showCapsuleBorder" checked aria-label="Show capsule border">
                  <span class="cmu-slider-switch"></span>
                </label>
              </div>
              ${createSlider('customControlBarWidth', 'Largeur', 60, 100, '%', 5)}
              ${createSlider('customControlBarHeight', 'Hauteur', 50, 100, 'px', 5)}
              ${createSlider('customControlBarPadding', 'Espacement', 10, 40, 'px', 5)}
            </div>
            
            <!-- Common Settings for All Modes -->
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
              ${createSlider('customControlBarOpacity', 'Opacité', 0, 1, '', 0.05)}
              ${createSlider('customControlBarBlur', 'Flou (Blur)', 0, 100, 'px')}
              ${createSlider('customControlBarSaturation', 'Saturation', 0, 300, '%', 10)}
              ${createSlider('customControlBarBrightness', 'Luminosité', 50, 150, '%', 5)}
              ${createSlider('customControlBarContrast', 'Contraste', 50, 200, '%', 5)}
            </div>
          </div>
          
          <!-- Quick Presets -->
          <div class="cmu-subsection">
            <h5>✨ Presets Rapides</h5>
            <div class="cmu-preset-buttons">
              <button class="cmu-preset-btn" data-preset="glassmorphism">
                <span>💎</span> Glass
              </button>
              <button class="cmu-preset-btn" data-preset="vibrant">
                <span>🌈</span> Vibrant
              </button>
              <button class="cmu-preset-btn" data-preset="pastel">
                <span>🎀</span> Pastel
              </button>
              <button class="cmu-preset-btn" data-preset="muted">
                <span>🌫️</span> Muted
              </button>
              <button class="cmu-preset-btn" data-preset="neon">
                <span>💜</span> Neon
              </button>
              <button class="cmu-preset-btn" data-preset="minimal">
                <span>⚪</span> Minimal
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- TAB 2: APPEARANCE -->
      <div class="cmu-tab-content" data-tab-content="appearance">
        ${createSectionHeader('Ambiance', 'ambiance', { icon: '🌈' })}
        <div class="cmu-setting-item">
          <label for="ambiance-toggle">Enable Ambiance</label>
          <label class="cmu-switch">
            <input type="checkbox" id="ambiance-toggle" data-key="ambianceEnabled" aria-label="Enable ambiance effect">
            <span class="cmu-slider-switch"></span>
          </label>
        </div>
        ${createSlider('ambianceBlur', 'Blur Intensity', 30, 250, 'px')}
        ${createSlider('ambianceOpacity', 'Opacity', 0, 1, '', 0.1)}
        ${createSlider('ambianceSaturation', 'Saturation', 0, 3, '', 0.1)}
        ${createSlider('ambianceHue', 'Hue Shift', 0, 360, '°')}
        
        ${createSectionHeader('Video Frame', 'appearance-frame', { icon: '🖼️' })}
        ${createSlider('videoBorderRadius', 'Rounded Corners', 0, 50, 'px')}
        ${createSlider('videoMaxSize', 'Video Size', 70, 90, '%')}
        ${createSectionHeader('Shadow', 'appearance-shadow', { icon: '🌫️' })}
        ${createSlider('videoShadowX', 'Horizontal', -50, 50, 'px')}
        ${createSlider('videoShadowY', 'Vertical', -50, 50, 'px')}
        ${createSlider('videoShadowBlur', 'Blur', 0, 100, 'px')}
        ${createSlider('videoShadowOpacity', 'Opacity', 0, 1, '', 0.1)}
      </div>
      
      <!-- TAB 3: VIDEO -->
      <div class="cmu-tab-content" data-tab-content="video">
        ${createSectionHeader('Playback', 'video-playback', { icon: '🎬' })}
        <div class="cmu-setting-item">
          <label>Speed Presets</label>
          <div class="cmu-speed-presets">
            <button class="cmu-speed-btn" data-speed="0.25">0.25x</button>
            <button class="cmu-speed-btn" data-speed="0.5">0.5x</button>
            <button class="cmu-speed-btn" data-speed="0.75">0.75x</button>
            <button class="cmu-speed-btn active" data-speed="1">1x</button>
            <button class="cmu-speed-btn" data-speed="1.25">1.25x</button>
            <button class="cmu-speed-btn" data-speed="1.5">1.5x</button>
            <button class="cmu-speed-btn" data-speed="2">2x</button>
          </div>
        </div>
        ${createSlider('playbackSpeed', 'Custom Speed', 0.25, 3, 'x', 0.05)}
        ${createSectionHeader('Transform', 'video-transform', { icon: '🧭' })}
        <div class="cmu-setting-item">
          <label for="loop-toggle">Loop Video</label>
          <label class="cmu-switch">
            <input type="checkbox" id="loop-toggle" data-key="enableLoop">
            <span class="cmu-slider-switch"></span>
          </label>
        </div>
        <div class="cmu-setting-item">
          <label for="flip-h-toggle">Flip Horizontal (Mirror)</label>
          <label class="cmu-switch">
            <input type="checkbox" id="flip-h-toggle" data-key="flipHorizontal">
            <span class="cmu-slider-switch"></span>
          </label>
        </div>
        <div class="cmu-setting-item">
          <label for="flip-v-toggle">Flip Vertical</label>
          <label class="cmu-switch">
            <input type="checkbox" id="flip-v-toggle" data-key="flipVertical">
            <span class="cmu-slider-switch"></span>
          </label>
        </div>
        ${createSectionHeader('Filters', 'video-filters', { icon: '🎨' })}
        ${createSlider('videoBrightness', 'Brightness', 0, 200, '%', 5)}
        ${createSlider('videoContrast', 'Contrast', 0, 200, '%', 5)}
        ${createSlider('videoSaturation', 'Saturation', 0, 300, '%', 10)}
        ${createSlider('videoHueRotate', 'Hue Rotate', 0, 360, '°', 5)}
        ${createSlider('videoBlur', 'Blur', 0, 10, 'px', 0.5)}
        ${createSlider('videoSepia', 'Sepia', 0, 100, '%', 5)}
        ${createSlider('videoGrayscale', 'Grayscale', 0, 100, '%', 5)}
        ${createSlider('videoInvert', 'Invert', 0, 100, '%', 5)}
        ${createSlider('videoAberration', 'Chromatic Aberration', 0, 100, '%', 5)}
        ${createSectionHeader('Tools', 'video-tools', { icon: '🛠️', hideReset: true })}
        <div class="cmu-feature-buttons">
          <button class="cmu-feature-btn cmu-pip-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/>
            </svg>
            Picture-in-Picture
          </button>
          <button class="cmu-feature-btn cmu-screenshot-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            Screenshot
          </button>
          <button class="cmu-feature-btn cmu-download-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download Video
          </button>
        </div>
      </div>
      
      <!-- TAB 4: SETTINGS -->
      <div class="cmu-tab-content" data-tab-content="settings">
        ${createSectionHeader('Behavior', 'behavior', { icon: '⚙️' })}
        ${createSlider('cursorHideDelay', 'Cursor Hide Delay', 1, 10, 's')}
        
        ${createSectionHeader('Music Metadata', 'music', { icon: '🎵' })}
        <div class="cmu-setting-item">
          <label for="spotify-toggle">Fetch Album Art (iTunes API)</label>
          <label class="cmu-switch">
            <input type="checkbox" id="spotify-toggle" data-key="useSpotify" aria-label="Enable music metadata integration">
            <span class="cmu-slider-switch"></span>
          </label>
        </div>
        <div id="spotify-status" style="padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.05); margin-top: 8px;">
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">
            <span id="spotify-connection-status">✅ iTunes API Ready (No auth required)</span>
          </p>
        </div>
        <p style="font-size: 11px; opacity: 0.6; margin: 8px 0 0 0;">
          Uses <strong>iTunes/Apple Music API</strong> to fetch high-quality album art (600x600). Free, no authentication needed.
        </p>
        
        <button class="cmu-restore-defaults-btn" aria-label="Restore default settings">Restore Defaults</button>
      </div>
    </div>`;
  return p;
}

/**
 * Create slider HTML
 */
function createSlider(key, label, min, max, unit, step = 1) {
  const sliderId = `slider-${key}`;
  const defaultValue = defaultSettings[key];
  const defaultAttr = defaultValue !== undefined ? ` data-default="${defaultValue}"` : '';
  return `<div class="cmu-setting-item">
    <label for="${sliderId}">${label}</label>
    <div class="cmu-slider-container">
      <input type="range" id="${sliderId}" min="${min}" max="${max}" step="${step}" data-key="${key}" data-unit="${unit}" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}"${defaultAttr}>
      <span class="cmu-slider-value" aria-live="polite"></span>
    </div>
  </div>`;
}
function updateSliderDisplay(input, rawValue) {
  if (!input) return;

  const numericValue = typeof rawValue === 'number' ? rawValue : parseFloat(rawValue);
  if (!Number.isFinite(numericValue)) return;

  input.value = numericValue;
  input.setAttribute('aria-valuenow', numericValue);

  const step = parseFloat(input.step) || 1;
  let precision = 0;
  if (!Number.isInteger(step)) {
    const stepStr = step.toString();
    const decimalPart = stepStr.includes('.') ? stepStr.split('.')[1] : '';
    precision = Math.min(decimalPart.length, 3);
  }

  let displayValue = numericValue;
  if (precision > 0) {
    displayValue = numericValue.toFixed(precision);
    displayValue = displayValue.replace(/\.0+$/, '');
  } else {
    displayValue = Math.round(numericValue).toString();
  }

  const valueSpan = input.closest('.cmu-slider-container')?.querySelector('.cmu-slider-value');
  if (valueSpan) {
    valueSpan.textContent = `${displayValue}${input.dataset.unit || ''}`;
  }

  const min = parseFloat(input.min || '0');
  const max = parseFloat(input.max || '100');
  const percent = max === min ? 0 : ((numericValue - min) / (max - min)) * 100;
  const clampedPercent = Math.max(0, Math.min(100, percent));
  input.style.setProperty('--cmu-slider-percent', `${clampedPercent}%`);
}

/**
 * Create interaction OSD (play/pause/volume/skip)
 */
function createInteractionOSD(type) {
  const osd = document.createElement('div');
  osd.id = `cmu-${type}-osd`;
  if (type === 'volume') {
    osd.innerHTML = `
      <span class="cmu-vol-icon">${ICONS.volumeHigh}</span>
      <div class="cmu-vol-bar-container"><div class="cmu-vol-bar"></div></div>
      <span class="cmu-vol-text"></span>
    `;
  }
  return osd;
}

/**
 * Show shortcut guide
 */
function showShortcutGuide() {
  let guide = document.getElementById(SHORTCUT_GUIDE_ID);
  const overlay = document.getElementById('cmu-overlay');
  if (!overlay || guide) return;
  
  guide = document.createElement('div');
  guide.id = SHORTCUT_GUIDE_ID;
  
  function createLine(key, desc) {
    return `<div><strong>${key}</strong><span>${desc}</span></div>`;
  }

  guide.innerHTML = `
    <h3>Keyboard Shortcuts</h3>
    ${createLine('K', 'Play / Pause')}
    ${createLine('← / →', 'Skip Back / Forward (10s)')}
    ${createLine('+ / -', 'Volume Up / Down')}
    ${createLine('F', 'Fullscreen')}
    ${createLine('U', 'Mute / Unmute')}
    ${createLine('L', 'Audio Mode (Listen)')}
    ${createLine('A', 'Ambiance Effect')}
    ${createLine('H', 'Show/Hide this Guide')}
    ${createLine('Shift+N', 'Next Video')}
    ${createLine('Shift+P', 'Previous Video')}
    ${createLine('Esc', 'Exit Cinema Mode')}
  `;
  overlay.appendChild(guide);

  // 🔧 FIX: Prevent menu hiding when hovering guide
  guide.addEventListener('mouseenter', () => clearTimeout(uiHideTimeout));
  guide.addEventListener('mouseleave', () => {
    // Restart hide timer when leaving guide
    import('./events.js').then(m => m.mouseMoveHandler());
  });

  setTimeout(() => {
    if (guide) guide.classList.add('visible');
  }, 10);
  
  setTimeout(() => {
    if (guide) {
      guide.classList.remove('visible');
      setTimeout(() => guide.remove(), 300);
    }
  }, 6000);
}

/**
 * Update UI state (controls, buttons, progress)
 */
function updateUiState() {
  if (!activeVideo) return;
  const controls = document.getElementById(CONTROLS_ID) || document.getElementById(SHORTS_CONTROLS_ID);
  if (!controls) return;
  
  if (document.getElementById(CONTROLS_ID)) {
    const Q = (s) => controls.querySelector(s);
    const playPauseBtn = Q('.cmu-play-pause-btn');
    playPauseBtn.innerHTML = activeVideo.paused ? ICONS.play : ICONS.pause;
    playPauseBtn.setAttribute('aria-label', activeVideo.paused ? 'Play' : 'Pause');
    
    Q('.cmu-volume-btn').innerHTML = activeVideo.muted || activeVideo.volume === 0 ? ICONS.volumeMute : ICONS.volumeHigh;
    Q('.cmu-volume-slider').value = activeVideo.muted ? 0 : activeVideo.volume;
    Q('.cmu-time-display').textContent = `${formatTime(activeVideo.currentTime)} / ${formatTime(activeVideo.duration || 0)}`;
    
    const progressPlayed = Q('.cmu-progress-played');
    const progress = (activeVideo.currentTime / activeVideo.duration) * 100 || 0;
    progressPlayed.style.width = `${progress}%`;
    progressPlayed.parentElement.parentElement.setAttribute('aria-valuenow', Math.round(progress));
  }

  const ambianceBtn = controls.querySelector('.cmu-ambiance-btn');
  if (ambianceBtn) {
    ambianceBtn.innerHTML = isAmbianceActive ? ICONS.ambianceOn : ICONS.ambianceOff;
    ambianceBtn.classList.toggle('active', isAmbianceActive);
    ambianceBtn.setAttribute('aria-pressed', isAmbianceActive ? 'true' : 'false');
  }

  // Update audio mode button state
  const audioModeBtn = controls.querySelector('.cmu-audio-mode-btn');
  if (audioModeBtn) {
    const audioModeActive = !!document.getElementById(AUDIO_MODE_CONTAINER_ID);
    audioModeBtn.classList.toggle('active', audioModeActive);
    audioModeBtn.setAttribute('aria-pressed', audioModeActive ? 'true' : 'false');
  }
  
  // Sync ambiance toggle in settings panel
  const settingsPanel = document.getElementById(SETTINGS_ID);
  if (settingsPanel) {
    const ambianceToggle = settingsPanel.querySelector('input[data-key="ambianceEnabled"]');
    if (ambianceToggle && ambianceToggle.checked !== isAmbianceActive) {
      ambianceToggle.checked = isAmbianceActive;
    }
  }
}

/**
 * Populate settings panel with current values
 */
function populateSettingsPanel() {
  const panel = document.getElementById(SETTINGS_ID);
  if (!panel) return;
  
  // Update theme bar active state
  panel.querySelectorAll('.cmu-theme-bar-btn').forEach(btn => {
    const isActive = btn.dataset.theme === settings.uiTheme;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  
  // Update presets active state (legacy)
  panel.querySelectorAll('.cmu-preset-btn').forEach(btn => {
    const isActive = btn.dataset.preset === settings.activePreset;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  
  panel.querySelector('input[data-key="ambianceEnabled"]').checked = isAmbianceActive;
  
  // Update loop toggle
  const loopToggle = panel.querySelector('input[data-key="enableLoop"]');
  if (loopToggle) {
    loopToggle.checked = settings.enableLoop || false;
  }
  
  // Update flip toggles
  const flipHToggle = panel.querySelector('input[data-key="flipHorizontal"]');
  if (flipHToggle) {
    flipHToggle.checked = settings.flipHorizontal || false;
  }
  
  const flipVToggle = panel.querySelector('input[data-key="flipVertical"]');
  if (flipVToggle) {
    flipVToggle.checked = settings.flipVertical || false;
  }
  
  // Update hide control bar bg toggle
  const hideControlBgToggle = panel.querySelector('input[data-key="hideControlBarBg"]');
  if (hideControlBgToggle) {
    hideControlBgToggle.checked = settings.hideControlBarBg || false;
  }
  
  // Update custom theme style buttons
  panel.querySelectorAll('.cmu-style-btn').forEach(btn => {
    const isActive = btn.dataset.style === (settings.customThemeStyle || 'glassmorphism');
    btn.classList.toggle('active', isActive);
  });

  // Update button shape buttons
  panel.querySelectorAll('.cmu-shape-btn').forEach(btn => {
    const isActive = btn.dataset.shape === (settings.buttonShape || 'circle');
    btn.classList.toggle('active', isActive);
  });
  
  // Update control bar style buttons
  panel.querySelectorAll('.cmu-bar-style-btn').forEach(btn => {
    const isActive = btn.dataset.barStyle === (settings.customControlBarStyle || 'normal');
    btn.classList.toggle('active', isActive);
  });
  
  // Show/hide capsule settings based on control bar style
  const capsuleSettings = panel.querySelector('#capsule-settings');
  if (capsuleSettings) {
    capsuleSettings.style.display = settings.customControlBarStyle === 'capsule' ? 'block' : 'none';
  }
  
  // Update Audio Mode controls
  const audioModeToggle = panel.querySelector('input[data-key="audioModeEnabled"]');
  if (audioModeToggle) {
    audioModeToggle.checked = settings.audioModeEnabled || false;
  }
  
  // Update Music toggle
  const spotifyToggle = panel.querySelector('input[data-key="useSpotify"]');
  if (spotifyToggle) {
    spotifyToggle.checked = settings.useSpotify !== undefined ? settings.useSpotify : true;
  }
  
  panel.querySelectorAll('.cmu-audio-cover-btn').forEach(btn => {
    const isActive = btn.dataset.coverType === (settings.audioCoverType || 'vinyl');
    btn.style.background = isActive ? 'var(--cmu-accent-color)' : 'rgba(255,255,255,0.1)';
    
    // Add click listener for instant update
    btn.addEventListener('click', () => {
      const coverType = btn.dataset.coverType;
      import('../core/settings.js').then(({ updateSetting }) => {
        updateSetting('audioCoverType', coverType);
      });
      
      // Update button styles immediately
      panel.querySelectorAll('.cmu-audio-cover-btn').forEach(b => {
        b.style.background = b === btn ? 'var(--cmu-accent-color)' : 'rgba(255,255,255,0.1)';
      });
    });
  });
  
  panel.querySelectorAll('input[type=range]').forEach(input => {
    const key = input.dataset.key;
    const fallback = input.dataset.default !== undefined ? parseFloat(input.dataset.default) : undefined;
    const value = settings[key] ?? fallback ?? parseFloat(input.min || '0');
    updateSliderDisplay(input, value);
  });
  
  // Update playback speed buttons
  const speedButtons = panel.querySelectorAll('.cmu-speed-btn');
  if (speedButtons.length > 0) {
    const currentSpeed = settings.playbackSpeed || 1;
    speedButtons.forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      btn.classList.toggle('active', Math.abs(btnSpeed - currentSpeed) < 0.01);
    });
  }
  
  // Show/hide custom theme controls based on theme
  const customThemeContainer = panel.querySelector('#custom-theme-container');
  if (customThemeContainer) {
    customThemeContainer.style.display = settings.uiTheme === 'custom' ? 'block' : 'none';
    
    // Initialize control bar mode display
    if (settings.uiTheme === 'custom') {
      const barStyle = settings.customControlBarStyle || 'normal';
      const normalSettings = panel.querySelector('#normal-mode-settings');
      const gradientSettings = panel.querySelector('#gradient-mode-settings');
      const capsuleSettings = panel.querySelector('#capsule-mode-settings');
      
      if (normalSettings) normalSettings.style.display = barStyle === 'normal' ? 'block' : 'none';
      if (gradientSettings) gradientSettings.style.display = barStyle === 'gradient' ? 'block' : 'none';
      if (capsuleSettings) capsuleSettings.style.display = barStyle === 'capsule' ? 'block' : 'none';
      
      // Update active button
      panel.querySelectorAll('.cmu-bar-style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.barStyle === barStyle);
      });
    }
  }
}

/**
 * Show interaction OSD
 */
function showInteractionOSD(type, icon) {
  let osd = document.getElementById(`cmu-${type}-osd`);
  if (osd) {
    osd.innerHTML = icon;
    osd.classList.add('visible');
    clearTimeout(interactionOSDTimeout);
    setInteractionOSDTimeout(setTimeout(() => {
      osd.classList.remove('visible');
    }, 500));
  }
}

/**
 * Show skip OSD
 */
function showSkipOSD(skipAmount) {
  let osd = document.getElementById('cmu-skip-osd');
  if (osd) {
    osd.innerHTML = `<span>${skipAmount > 0 ? '+' : ''}${skipAmount}s</span>`;
    osd.classList.add('visible');
    clearTimeout(skipOSDTimeout);
    setSkipOSDTimeout(setTimeout(() => {
      osd.classList.remove('visible');
      setCurrentSkipAmount(0);
    }, 800));
  }
}

/**
 * Show volume OSD
 */
function showVolumeOSD(volume, muted) {
  let osd = document.getElementById('cmu-volume-osd');
  if (osd) {
    osd.querySelector('.cmu-vol-icon').innerHTML = muted || volume === 0 ? ICONS.volumeMute : ICONS.volumeHigh;
    osd.querySelector('.cmu-vol-text').textContent = `${Math.round(volume)}%`;
    osd.querySelector('.cmu-vol-bar').style.width = `${muted ? 0 : volume}%`;
    osd.classList.add('visible');
    clearTimeout(volumeOSDTimeout);
    setVolumeOSDTimeout(setTimeout(() => {
      osd.classList.remove('visible');
    }, 1200));
  }
}


// 🎮 EVENT HANDLERS - Keyboard, mouse, video events










let isVolumeLocked = false;
let volumeLockTimeout;
let lastUserVolume = null; // Track the last volume set by user
let isTransitioning = false; // Track if we're activating/deactivating cinema mode
let shouldShowVolumeOSD = false; // Only show OSD when user manually changes volume

const FILTER_KEYS = [
  'videoBrightness',
  'videoContrast',
  'videoSaturation',
  'videoHueRotate',
  'videoBlur',
  'videoSepia',
  'videoGrayscale',
  'videoInvert',
  'videoAberration',
];

const SECTION_RESET_CONFIG = {
  ambiance: ['ambianceEnabled', 'ambianceBlur', 'ambianceOpacity', 'ambianceSaturation', 'ambianceHue'],
  'appearance-frame': ['videoBorderRadius', 'videoMaxSize'],
  'appearance-shadow': ['videoShadowX', 'videoShadowY', 'videoShadowBlur', 'videoShadowOpacity'],
  'video-playback': ['playbackSpeed'],
  'video-transform': ['enableLoop', 'flipHorizontal', 'flipVertical'],
  'video-filters': FILTER_KEYS,
  behavior: ['cursorHideDelay'],
  'custom-theme': [
    'customHue',
    'customMenuOpacity',
    'customMenuBlur',
    'customMenuSaturation',
    'customMenuBrightness',
    'customMenuContrast',
    'customMenuBorderOpacity',
    'customControlBarOpacity',
    'customControlBarBlur',
    'customControlBarSaturation',
    'customControlBarBrightness',
    'customControlBarContrast',
    'customButtonBgOpacity',
    'customButtonBorderOpacity',
    'customButtonHoverBgOpacity',
    'customButtonTextLightness',
    'customMenuTextLightness',
      'customMenuHeadingLightness',
  ],
};

/**
 * Make an element draggable by its header
 */
function makeDraggable(element, handle) {
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;

  handle.style.cursor = 'move';
  handle.addEventListener('mousedown', dragMouseDown);

  function dragMouseDown(e) {
    // Don't drag if clicking on buttons
    if (e.target.closest('button')) return;
    
    e.preventDefault();
    e.stopPropagation(); // Prevent video pause
    
    isDragging = true;
    
    // Get current element position
    const rect = element.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
    
    // Add visual feedback
    element.style.transition = 'none';
    element.style.opacity = '0.9';
    element.style.zIndex = '100'; // Bring to front while dragging
  }

  function elementDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation(); // Prevent video pause
    
    // Calculate new position relative to mouse
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    // Constrain to viewport
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));
    
    // Apply position
    element.style.left = currentX + 'px';
    element.style.top = currentY + 'px';
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'none';
  }

  function closeDragElement() {
    isDragging = false;
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', closeDragElement);
    
    // Restore visual state
    element.style.transition = '';
    element.style.opacity = '';
    element.style.zIndex = '50'; // Reset to normal z-index but above cover
  }
}

/**
 * Keyboard event handler
 */
function keyHandler(e) {
  // Play/Pause with K (capture and handle)
  if (e.key.toLowerCase() === 'k' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    e.stopPropagation();
    togglePlayPause();
    return;
  }
  
  // Show OSD for Space (let YouTube handle the actual pause/play)
  if (e.key === ' ' && !e.target.matches('input, textarea')) {
    showInteractionOSD('playpause', activeVideo.paused ? ICONS.pause : ICONS.play);
    return;
  }
  
  if (document.activeElement?.closest('input, textarea')) return;
  
  const isSettingsVisible = document.getElementById(SETTINGS_ID)?.classList.contains('visible');
  if (e.key.toLowerCase() === 'escape' && isSettingsVisible) {
    e.preventDefault();
    e.stopPropagation();
    toggleSettingsPanel();
    return;
  }
  
  if (isSettingsVisible) return;

  switch (e.key.toLowerCase()) {
    case 'escape':
      e.preventDefault();
      e.stopPropagation();
      if (window.deactivateCinemaMode) window.deactivateCinemaMode();
      break;
    case 'f':
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
      break;
    case 'u':
      e.preventDefault();
      e.stopPropagation();
      if (activeVideo) activeVideo.muted = !activeVideo.muted;
      break;
    case 'a':
      e.preventDefault();
      e.stopPropagation();
      toggleAmbiance();
      break;
    case 'l':  // L for Listen mode (avoid conflict with M=mute)
      e.preventDefault();
      e.stopPropagation();
      toggleAudioMode();
      break;
    case 'h':
      e.preventDefault();
      e.stopPropagation();
      toggleShortcutGuide();
      break;
    case 'arrowleft':
      e.preventDefault();
      e.stopPropagation();
      skipVideo(-10);
      break;
    case 'arrowright':
      e.preventDefault();
      e.stopPropagation();
      skipVideo(10);
      break;
    case '+':
    case '=': // 🔧 FIX: Support both + and = (same key without shift)
      e.preventDefault();
      e.stopPropagation();
      changeVolume(0.05, 'user_hotkey');
      break;
    case '-':
    case '_': // 🔧 FIX: Support both - and _ (same key with shift)
      e.preventDefault();
      e.stopPropagation();
      changeVolume(-0.05, 'user_hotkey');
      break;
    case 'n':
      if (e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        clickYoutubeButton(['.ytp-next-button', 'button[aria-label="Next"]', 'button[aria-label="Suivant"]']);
      }
      break;
    case 'p':
      if (e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        clickYoutubeButton(['.ytp-prev-button', 'button[aria-label="Previous"]', 'button[aria-label="Précédent"]']);
      }
      break;
  }
}

/**
 * Click handler (single click = play/pause)
 */
function clickHandler(e) {
  // 🔧 FIX: Exclude controls AND progress bar to avoid time jump
  if (e.target.closest(`#${CONTROLS_ID}, #${SHORTS_CONTROLS_ID}, #${SETTINGS_ID}, #${SHORTCUT_GUIDE_ID}, .cmu-progress-bar-container`)) return;
  
  clearTimeout(clickTimeout);
  setClickTimeout(setTimeout(() => {
    togglePlayPause();
  }, 250)); // 🔧 FIX: Increased from 200ms to 250ms to better detect double-click
}

/**
 * Double click handler (fullscreen)
 */
function dblClickHandler(e) {
  if (e.target.closest(`#${CONTROLS_ID}, #${SHORTS_CONTROLS_ID}, #${SETTINGS_ID}, #${SHORTCUT_GUIDE_ID}`)) return;
  
  clearTimeout(clickTimeout);
  toggleFullscreen();
}

/**
 * Mouse move handler (show/hide UI)
 */
function mouseMoveHandler() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.style.cursor = 'default';
  const controls = document.getElementById(CONTROLS_ID) || document.getElementById(SHORTS_CONTROLS_ID);
  if (controls) controls.classList.remove('hidden');
  
  clearTimeout(uiHideTimeout);
  
  // Don't auto-hide during initial load (first 3 seconds)
  if (isInitialLoad) {
    setTimeout(() => setIsInitialLoad(false), 3000);
    return;
  }
  
  setUiHideTimeout(setTimeout(() => {
    const settingsVisible = document.getElementById(SETTINGS_ID)?.classList.contains('visible');
    const guideVisible = document.getElementById(SHORTCUT_GUIDE_ID)?.classList.contains('visible');
    if (!settingsVisible && !guideVisible) {
      if (overlay) overlay.style.cursor = 'none';
      if (controls) controls.classList.add('hidden');
    }
  }, settings.cursorHideDelay * 1000));
}

/**
 * Seek in video (progress bar click/drag)
 */
function seek(e) {
  const rect = document.querySelector(`#${OVERLAY_ID} .cmu-progress-bar-container`)?.getBoundingClientRect();
  if (rect && activeVideo) {
    activeVideo.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * activeVideo.duration;
  }
}

/**
 * Toggle play/pause
 */
function togglePlayPause() {
  if (!activeVideo) return;
  activeVideo.paused ? activeVideo.play() : activeVideo.pause();
  showInteractionOSD('playpause', activeVideo.paused ? ICONS.pause : ICONS.play);
}

/**
 * Toggle fullscreen
 */
function toggleFullscreen() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!document.fullscreenElement && overlay) {
    overlay.requestFullscreen().catch(err => console.error(err));
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

/**
 * Toggle settings panel
 */
function toggleSettingsPanel() {
  const panel = document.getElementById(SETTINGS_ID);
  if (!panel) return;
  
  const isVisible = panel.classList.contains('visible');
  
  if (!isVisible) {
    // Opening
    panel.classList.remove('hiding');
    panel.classList.add('visible');
    panel.style.display = 'block';
    
    // Initialize draggable if not already done
    if (!panel.dataset.draggableInit) {
      panel.dataset.draggableInit = 'true';
      const header = panel.querySelector('.cmu-settings-header');
      if (header) {
        makeDraggable(panel, header);
      }
    }
    
    populateSettingsPanel();
    clearTimeout(uiHideTimeout);
    const controls = document.getElementById(CONTROLS_ID) || document.getElementById(SHORTS_CONTROLS_ID);
    if (controls) controls.classList.remove('hidden');
    document.getElementById(SHORTCUT_GUIDE_ID)?.remove();
  } else {
    // Closing with animation
    panel.classList.remove('is-dragging');
    panel.querySelector('.cmu-settings-header')?.classList.remove('is-dragging');
    panel.classList.add('hiding');
    panel.classList.remove('visible');
    setTimeout(() => {
      if (panel.classList.contains('hiding')) {
        panel.classList.remove('hiding');
        panel.style.display = 'none';
      }
    }, 350); // Match animation duration
    mouseMoveHandler();
  }
}

/**
 * Toggle shortcut guide
 */
function toggleShortcutGuide() {
  // 🔧 FIX: Direct import instead of dynamic to fix bundle issues
  let guide = document.getElementById(SHORTCUT_GUIDE_ID);
  if (!guide) {
    showShortcutGuide();
    document.getElementById(SETTINGS_ID)?.classList.remove('visible');
  } else {
    guide.classList.remove('visible');
    setTimeout(() => guide.remove(), 300);
  }
}

/**
 * Skip video forward/backward
 */
function skipVideo(seconds) {
  if (!activeVideo) return;
  activeVideo.currentTime += seconds;
  setCurrentSkipAmount(currentSkipAmount + seconds);
  showSkipOSD(currentSkipAmount);
}

/**
 * Change volume
 */
function changeVolume(delta, source = 'unknown') {
  if (!activeVideo) return;
  const oldVolume = activeVideo.volume;
  activeVideo.muted = false;
  const newVolume = Math.max(0, Math.min(1, activeVideo.volume + delta));
  activeVideo.volume = newVolume;
  lastUserVolume = newVolume; // Store user's intended volume

  console.log(`[Lumen] 🔊 Volume changed by ${source}: ${(oldVolume*100).toFixed(0)}% → ${(newVolume*100).toFixed(0)}%`);

  // Lock volume for a short period to prevent external changes
  isVolumeLocked = true;
  clearTimeout(volumeLockTimeout);
  volumeLockTimeout = setTimeout(() => {
    isVolumeLocked = false;
  }, 200); // Lock for 200ms
}

/**
 * Utility to click a YouTube button using multiple selectors.
 */
function clickYoutubeButton(selectors) {
    for (const selector of selectors) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.click();
            console.log(`[Lumen] ✅ Clicked YouTube button with selector: ${selector}`);
            return true;
        }
    }
    console.warn(`[Lumen] ⚠️ Could not find YouTube button with selectors: ${selectors.join(', ')}`);
    return false;
}


/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Set transitioning flag to prevent volume OSD during activation
  isTransitioning = true;
  setTimeout(() => {
    isTransitioning = false;
  }, 500); // Clear transition flag after 500ms
  
  document.addEventListener('keydown', keyHandler, true);
  const overlay = document.getElementById(OVERLAY_ID);
  overlay?.addEventListener('mousemove', mouseMoveHandler);
  overlay?.addEventListener('click', clickHandler);
  overlay?.addEventListener('dblclick', dblClickHandler);
  document.addEventListener('fullscreenchange', applyDynamicStyles);
  mouseMoveHandler();
  
  const Q = (s) => overlay.querySelector(s);
  const controls = document.getElementById(CONTROLS_ID) || document.getElementById(SHORTS_CONTROLS_ID);
  
  // 🔧 FIX: Prevent controls from hiding when mouse is over them
  if (controls) {
    controls.addEventListener('mouseenter', () => {
      clearTimeout(uiHideTimeout);
    });
    controls.addEventListener('mouseleave', () => {
      mouseMoveHandler(); // Restart hide timer
    });
  }
  
  // 🔧 FIX: Same for settings panel (guide listeners are in showShortcutGuide)
  const settingsPanel = document.getElementById(SETTINGS_ID);
  if (settingsPanel) {
    settingsPanel.addEventListener('mouseenter', () => clearTimeout(uiHideTimeout));
    settingsPanel.addEventListener('mouseleave', () => mouseMoveHandler());
    
    // Make settings panel draggable by its header
    const header = settingsPanel.querySelector('.cmu-settings-header');
    if (header) {
      makeDraggable(settingsPanel, header);
    }
    
    // Add close button event listener
    const closeBtn = settingsPanel.querySelector('.cmu-close-settings-btn');
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleSettingsPanel();
      };
    }
    
    // Prevent clicks on settings panel from bubbling to video
    settingsPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  if (controls && controls.id === CONTROLS_ID) {
    Q('.cmu-play-pause-btn').onclick = () => togglePlayPause();
    if (document.querySelector('.ytp-next-button, button[aria-label="Next"], button[aria-label="Suivant"]')) {
      Q('.cmu-next-track-btn').onclick = (e) => {
        e.stopPropagation();
        clickYoutubeButton(['.ytp-next-button', 'button[aria-label="Next"]', 'button[aria-label="Suivant"]']);
      };
    }
    if (document.querySelector('.ytp-prev-button, button[aria-label="Previous"], button[aria-label="Précédent"]')) {
      Q('.cmu-prev-track-btn').onclick = (e) => {
        e.stopPropagation();
        clickYoutubeButton(['.ytp-prev-button', 'button[aria-label="Previous"]', 'button[aria-label="Précédent"]']);
      };
    }
    Q('.cmu-settings-btn').onclick = (e) => {
      e.stopPropagation();
      toggleSettingsPanel();
    };
    Q('.cmu-fullscreen-btn').onclick = () => toggleFullscreen();
    Q('.cmu-volume-btn').onclick = () => {
      if (activeVideo) {
        shouldShowVolumeOSD = true; // Enable OSD for mute toggle
        activeVideo.muted = !activeVideo.muted;
        setTimeout(() => { shouldShowVolumeOSD = false; }, 300);
      }
    };
    Q('.cmu-volume-slider').oninput = (e) => {
      if (activeVideo) {
        const newVolume = parseFloat(e.target.value);
        activeVideo.muted = false;
        
        // Calculate delta and call changeVolume to trigger lock
        const delta = newVolume - activeVideo.volume;
        changeVolume(delta, 'user_ui_slider');
      }
    };
    const progressBar = Q('.cmu-progress-bar-container');
    progressBar.onmousedown = (e) => {
      setIsSeeking(true);
      seek(e);
    };
  }

  if (controls) {
    controls.querySelector('.cmu-ambiance-btn').onclick = (e) => {
      e.stopPropagation();
      toggleAmbiance();
    };

    // Audio mode button
    const audioModeBtn = controls.querySelector('.cmu-audio-mode-btn');
    if (audioModeBtn) {
      audioModeBtn.onclick = (e) => {
        e.stopPropagation();
        toggleAudioMode();
      };
    }
    
    controls.querySelector('.cmu-exit-btn').onclick = () => {
      if (window.deactivateCinemaMode) window.deactivateCinemaMode();
    };
  }

  document.addEventListener('mousemove', (e) => {
    if (isSeeking) seek(e);
  });
  document.addEventListener('mouseup', () => setIsSeeking(false));
  
  // Apply video settings (playback speed, loop, etc.)
  applyVideoSettings(activeVideo, settings);
  applyVideoFlip();
  applyVideoFilters();
  
  activeVideo.addEventListener('timeupdate', updateUiState);
  activeVideo.addEventListener('play', updateUiState);
  activeVideo.addEventListener('pause', updateUiState);
  
  // CRITICAL: Volume change listener - only show OSD for manual changes
  activeVideo.addEventListener('volumechange', () => {
    if (isVolumeLocked && lastUserVolume !== null) {
        // An external script (likely YouTube) tried to change the volume during lock
        // Force it back to user's intended volume
        if (Math.abs(activeVideo.volume - lastUserVolume) > 0.01) {
          console.warn(`[Lumen] 🛡️ Blocking external volume change: ${(activeVideo.volume*100).toFixed(0)}% → ${(lastUserVolume*100).toFixed(0)}%`);
          activeVideo.volume = lastUserVolume;
          return; // Don't update UI or show OSD for blocked changes
        }
    }
    
    updateUiState();
    
    // ONLY show volume OSD if this was a manual user change
    if (shouldShowVolumeOSD && activeVideo) {
      showVolumeOSD(activeVideo.volume * 100, activeVideo.muted);
    }
  });
  
  const panel = document.getElementById(SETTINGS_ID);
  if (panel) {
    panel.querySelector('.cmu-restore-defaults-btn').onclick = restoreDefaultSettings;
    panel.querySelectorAll('input[type=range]').forEach(input => {
      input.addEventListener('input', (e) => {
        const { key } = e.target.dataset;
        const numericValue = parseFloat(e.target.value);

        console.log(`🎛️ Slider changed: ${key} = ${numericValue}`);

        updateSetting(key, numericValue);
        updateSliderDisplay(e.target, numericValue);

        if (key.startsWith('custom')) {
          if (settings.uiTheme !== 'custom') {
            console.log('🔄 Switching to custom theme');
            updateSetting('uiTheme', 'custom');
            populateSettingsPanel();
          }
          console.log('✨ Applying dynamic styles for custom property');
          applyDynamicStyles(); // ALWAYS apply styles for custom properties
        }

        if (FILTER_KEYS.includes(key)) {
          applyVideoFilters();
        } else if (key.startsWith('ambiance')) {
          updateAmbianceControls(settings.ambianceEnabled);
        }
      });

      input.addEventListener('dblclick', (e) => {
        const { key } = e.target.dataset;
        const defaultValue = defaultSettings[key];
        if (defaultValue === undefined) return;

        updateSetting(key, defaultValue);
        updateSliderDisplay(e.target, defaultValue);

        if (key.startsWith('custom')) {
          applyDynamicStyles(); // Apply styles after reset
        }

        if (FILTER_KEYS.includes(key)) {
          applyVideoFilters();
        } else if (key.startsWith('ambiance')) {
          updateAmbianceControls(settings.ambianceEnabled);
        }
      });
    });

    panel.querySelectorAll('.cmu-section-reset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sectionKey = e.currentTarget.dataset.section;
        handleSectionReset(sectionKey);
      });
    });
    panel.querySelector('input[data-key="ambianceEnabled"]').addEventListener('change', (e) => {
      const newValue = e.target.checked;
      setIsAmbianceActive(newValue);
      updateSetting('ambianceEnabled', newValue);
      if (newValue) {
        startAmbiance();
      } else {
        stopAmbiance();
      }
      updateUiState();
      updateAmbianceControls(newValue);
      applyDynamicStyles();
    });
    
    // Tab navigation
    panel.querySelectorAll('.cmu-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        
        // Remove active from all tabs and contents
        panel.querySelectorAll('.cmu-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.cmu-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active to clicked tab and corresponding content
        e.currentTarget.classList.add('active');
        panel.querySelector(`[data-tab-content="${tabName}"]`)?.classList.add('active');
      });
    });
    
        // Theme bar buttons
        panel.querySelectorAll('.cmu-theme-bar-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const themeName = e.currentTarget.dataset.theme;
                const previousThemeName = settings.uiTheme;

                // Special handling for Random Theme - always generate a new theme
                if (themeName === 'random') {
                    const randomTheme = generateRandomTheme();
                    console.log('[Lumen] 🎲 Generated random theme:', randomTheme);
                    
                    // Apply the random theme values as custom settings
                    const randomSettings = {
                        customHue: randomTheme.values.hue,
                        customMenuOpacity: randomTheme.values.menuOpacity,
                        customMenuBlur: randomTheme.values.menuBlur,
                        customMenuSaturation: randomTheme.values.menuSaturation,
                        customMenuBrightness: randomTheme.values.menuBrightness,
                        customMenuContrast: randomTheme.values.menuContrast,
                        customMenuBorderOpacity: randomTheme.values.menuBorderOpacity,
                        customControlBarOpacity: randomTheme.values.controlBarOpacity,
                        customControlBarBlur: randomTheme.values.controlBarBlur,
                        customControlBarSaturation: randomTheme.values.controlBarSaturation,
                        customControlBarBrightness: randomTheme.values.controlBarBrightness,
                        customControlBarContrast: randomTheme.values.controlBarContrast,
                        buttonShape: randomTheme.values.buttonShape,
                        customButtonBgOpacity: randomTheme.values.buttonBgOpacity,
                        customButtonBorderOpacity: randomTheme.values.buttonBorderOpacity,
                        customButtonHoverBgOpacity: randomTheme.values.buttonHoverBgOpacity,
                        customButtonTextLightness: randomTheme.values.buttonTextLightness,
                        customMenuTextLightness: randomTheme.values.menuTextLightness,
                        customMenuHeadingLightness: randomTheme.values.menuHeadingLightness,
                        uiTheme: 'custom' // Apply as custom theme
                    };
                    
                    updateMultipleSettings(randomSettings);
                    chrome.storage.sync.set({ savedCustomTheme: randomSettings });
                    
                    // Update UI
                    populateSettingsPanel();
                    applyDynamicStyles();
                    updateYoutubeLogoVisibility();
                    return; // Exit early for random theme
                }

                // Special handling for Auto Theme - time-based theme switching
                if (themeName === 'auto') {
                    updateSetting('uiTheme', 'auto');
                    populateSettingsPanel();
                    applyDynamicStyles();
                    updateYoutubeLogoVisibility();
                    return; // Exit early for auto theme
                }

                // Prevent re-applying the same theme
                if (themeName === previousThemeName) return;

                // When switching to 'Custom', check if we have saved custom values
                if (themeName === 'custom') {
                    // Try to load saved custom theme from storage
                    chrome.storage.sync.get('savedCustomTheme', (result) => {
                        if (result.savedCustomTheme && previousThemeName === 'custom') {
                            // User was already on custom and clicked it again, or returning to custom
                            // Load the saved custom values
                            console.log('[Lumen] 🎨 Loading saved custom theme');
                            updateMultipleSettings({ ...result.savedCustomTheme, uiTheme: 'custom' });
                        } else if (previousThemeName !== 'custom') {
                            // First time switching to custom from another theme - inherit
                            const prevThemeObject = UI_THEMES[previousThemeName];

                            if (prevThemeObject && prevThemeObject.values) {
                                console.log(`[Lumen] 🎨 Inheriting properties from theme: ${previousThemeName}`);
                                

                                const inheritedSettings = {
                                    // General
                                    customHue: prevThemeObject.values.hue,
                                    
                                    // Menu
                                    customMenuOpacity: prevThemeObject.values.menuOpacity,
                                    customMenuBlur: prevThemeObject.values.menuBlur,
                                    customMenuSaturation: prevThemeObject.values.menuSaturation,
                                    customMenuBrightness: prevThemeObject.values.menuBrightness,
                                    customMenuContrast: prevThemeObject.values.menuContrast,
                                    customMenuBorderOpacity: prevThemeObject.values.menuBorderOpacity,

                                    // Control Bar
                                    hideControlBarBg: prevThemeObject.values.hideControlBarBg,
                                    customControlBarOpacity: prevThemeObject.values.controlBarOpacity,
                                    customControlBarBlur: prevThemeObject.values.controlBarBlur,
                                    customControlBarSaturation: prevThemeObject.values.controlBarSaturation,
                                    customControlBarBrightness: prevThemeObject.values.controlBarBrightness,
                                    customControlBarContrast: prevThemeObject.values.controlBarContrast,

                                    // Buttons
                                    buttonShape: prevThemeObject.values.buttonShape,
                                    customButtonBgOpacity: prevThemeObject.values.buttonBgOpacity,
                                    customButtonBorderOpacity: prevThemeObject.values.buttonBorderOpacity,
                                    customButtonHoverBgOpacity: prevThemeObject.values.buttonHoverBgOpacity,
                                    customButtonTextLightness: prevThemeObject.values.buttonTextLightness,

                                    // Text
                                    customMenuTextLightness: prevThemeObject.values.menuTextLightness,
                                    customMenuHeadingLightness: prevThemeObject.values.menuHeadingLightness,

                                    // Finally, set the theme to custom
                                    uiTheme: 'custom'
                                };

                                // Batch update all settings at once
                                updateMultipleSettings(inheritedSettings);
                                // Save these as the new custom theme
                                chrome.storage.sync.set({ savedCustomTheme: inheritedSettings });
                                console.log('[Lumen] ✅ Custom theme inherited and saved');
                            } else {
                                // Fallback if previous theme is not found
                                updateSetting('uiTheme', 'custom');
                            }
                        } else {
                            // Just switch to custom with default values
                            updateSetting('uiTheme', 'custom');
                        }
                        
                        // Update UI after any theme change
                        populateSettingsPanel();
                        applyDynamicStyles();
                        updateYoutubeLogoVisibility();
                    });
                } else {
                    // Switching from custom to another theme - save current custom values
                    if (previousThemeName === 'custom') {
                        const customValues = {
                            customHue: settings.customHue,
                            customMenuOpacity: settings.customMenuOpacity,
                            customMenuBlur: settings.customMenuBlur,
                            customMenuSaturation: settings.customMenuSaturation,
                            customMenuBrightness: settings.customMenuBrightness,
                            customMenuContrast: settings.customMenuContrast,
                            customMenuBorderOpacity: settings.customMenuBorderOpacity,
                            hideControlBarBg: settings.hideControlBarBg,
                            customControlBarOpacity: settings.customControlBarOpacity,
                            customControlBarBlur: settings.customControlBarBlur,
                            customControlBarSaturation: settings.customControlBarSaturation,
                            customControlBarBrightness: settings.customControlBarBrightness,
                            customControlBarContrast: settings.customControlBarContrast,
                            buttonShape: settings.buttonShape,
                            customButtonBgOpacity: settings.customButtonBgOpacity,
                            customButtonBorderOpacity: settings.customButtonBorderOpacity,
                            customButtonHoverBgOpacity: settings.customButtonHoverBgOpacity,
                            customButtonTextLightness: settings.customButtonTextLightness,
                            customMenuTextLightness: settings.customMenuTextLightness,
                            customMenuHeadingLightness: settings.customMenuHeadingLightness,
                        };
                        chrome.storage.sync.set({ savedCustomTheme: customValues });
                        console.log('[Lumen] 💾 Saved custom theme values');
                    }
                    
                    // For any other theme change, just update the theme name
                    updateSetting('uiTheme', themeName);
                    
                    // Update UI after any theme change
                    populateSettingsPanel();
                    applyDynamicStyles();
                    updateYoutubeLogoVisibility();
                }
        });
    });
    
    
    panel.querySelectorAll('.cmu-theme-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const newColor = e.target.dataset.color;
        updateSetting('themeColor', newColor);
        populateSettingsPanel();
      });
    });
    
    // Video Controls - Playback Speed
    panel.querySelectorAll('.cmu-speed-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const speed = parseFloat(e.currentTarget.dataset.speed);
        setPlaybackSpeed(speed);
        updateSpeedButtons(speed);
      });
    });
    
    panel.querySelector('input[data-key="playbackSpeed"]')?.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      setPlaybackSpeed(speed);
      updateSpeedButtons(speed);
    });
    
    // Video Controls - Loop Toggle
    panel.querySelector('input[data-key="enableLoop"]')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      updateSetting('enableLoop', enabled);
      if (activeVideo) {
        activeVideo.loop = enabled;
      }
    });
    
    // Video Controls - Picture-in-Picture
    panel.querySelector('.cmu-pip-btn')?.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (activeVideo && document.pictureInPictureEnabled) {
          await activeVideo.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP error:', err);
      }
    });
    
    // Video Controls - Screenshot
    panel.querySelector('.cmu-screenshot-btn')?.addEventListener('click', () => {
      takeScreenshot();
    });
    
    // Video Controls - Download Video
    panel.querySelector('.cmu-download-btn')?.addEventListener('click', () => {
      downloadVideo();
    });
    
    // Video Controls - Flip Horizontal
    panel.querySelector('input[data-key="flipHorizontal"]')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      updateSetting('flipHorizontal', enabled);
      applyVideoFlip();
    });
    
    // Video Controls - Flip Vertical
    panel.querySelector('input[data-key="flipVertical"]')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      updateSetting('flipVertical', enabled);
      applyVideoFlip();
    });
    
    // Custom Theme - Control Bar Background Toggle (Normal Mode)
    panel.querySelector('input[data-key="showControlBarBg"]')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      updateSetting('showControlBarBg', enabled);
      if (settings.uiTheme === 'custom') {
        applyDynamicStyles();
      }
    });
    
    // Custom Theme - Capsule Border Toggle (Capsule Mode)
    panel.querySelector('input[data-key="showCapsuleBorder"]')?.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      updateSetting('showCapsuleBorder', enabled);
      if (settings.uiTheme === 'custom') {
        applyDynamicStyles();
      }
    });
    
    // Video Filters
    const filterKeys = [
      'videoBrightness',
      'videoContrast',
      'videoSaturation',
      'videoHueRotate',
      'videoBlur',
      'videoSepia',
      'videoGrayscale',
      'videoInvert'
    ];
    
    filterKeys.forEach(key => {
      panel.querySelector(`input[data-key="${key}"]`)?.addEventListener('input', (e) => {
        updateSetting(key, parseFloat(e.target.value));
        applyVideoFilters();
      });
    });
    
    // Custom Theme - Style Presets
    panel.querySelectorAll('.cmu-style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const style = e.currentTarget.dataset.style;
        updateSetting('customThemeStyle', style);
        
        panel.querySelectorAll('.cmu-style-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (settings.uiTheme !== 'custom') {
          updateSetting('uiTheme', 'custom');
          populateSettingsPanel();
        } else {
          applyDynamicStyles();
        }
      });
    });
    
    // Custom Theme - Button Shape
    panel.querySelectorAll('.cmu-shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shape = e.currentTarget.dataset.shape;
        updateSetting('buttonShape', shape);
        
        panel.querySelectorAll('.cmu-shape-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (settings.uiTheme !== 'custom') {
          updateSetting('uiTheme', 'custom');
          populateSettingsPanel();
        } else {
          applyDynamicStyles();
        }
      });
    });
    
    // Custom Theme - Control Bar Style
    panel.querySelectorAll('.cmu-bar-style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const barStyle = e.currentTarget.dataset.barStyle;
        console.log(`🎨 Control Bar Style changed to: ${barStyle}`);
        updateSetting('customControlBarStyle', barStyle);
        
        panel.querySelectorAll('.cmu-bar-style-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Show/hide mode-specific settings
        const normalSettings = panel.querySelector('#normal-mode-settings');
        const gradientSettings = panel.querySelector('#gradient-mode-settings');
        const capsuleSettings = panel.querySelector('#capsule-mode-settings');
        
        if (normalSettings) normalSettings.style.display = barStyle === 'normal' ? 'block' : 'none';
        if (gradientSettings) gradientSettings.style.display = barStyle === 'gradient' ? 'block' : 'none';
        if (capsuleSettings) capsuleSettings.style.display = barStyle === 'capsule' ? 'block' : 'none';

        if (settings.uiTheme !== 'custom') {
          console.log('🔄 Switching to custom theme for bar style change');
          updateSetting('uiTheme', 'custom');
          populateSettingsPanel();
        } else {
          console.log('✨ Applying dynamic styles for bar style change');
          applyDynamicStyles();
        }
      });
    });
    
    // Custom Theme - Quick Presets
    panel.querySelectorAll('.cmu-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.dataset.preset;
        applyCustomPreset(preset);
        
        if (settings.uiTheme !== 'custom') {
          updateSetting('uiTheme', 'custom');
          populateSettingsPanel();
        } else {
          applyDynamicStyles();
        }
      });
    });
    
    // Genius API Token
    const geniusTokenInput = panel.querySelector('#genius-token-input');
    if (geniusTokenInput) {
      geniusTokenInput.addEventListener('input', (e) => {
        const token = e.target.value.trim();
        updateSetting('geniusApiToken', token);
        console.log('[Lumen] Genius API token updated');
      });
    }
  }
}

/**
 * Apply custom theme preset
 */
function applyCustomPreset(presetName) {
  const presets = {
    glassmorphism: {
      customHue: 200,
      customMenuOpacity: 0.15,
      customMenuBlur: 60,
      customMenuSaturation: 180,
      customMenuBrightness: 110,
      customMenuContrast: 120,
      customMenuBorderOpacity: 0.2,
      customMenuTextLightness: 100,
      customMenuHeadingLightness: 97,
      customControlBarOpacity: 0.2,
      customControlBarBlur: 80,
      customControlBarSaturation: 180,
      customControlBarBrightness: 110,
      customControlBarContrast: 120,
      customControlBarStyle: 'normal',
      buttonShape: 'circle',
      customButtonSize: 44,
      customButtonSpacing: 12,
      customButtonBgOpacity: 0.08,
      customButtonBorderOpacity: 0.15,
      customButtonHoverBgOpacity: 0.25,
      customButtonTextLightness: 100,
    },
    vibrant: {
      customHue: 280,
      customMenuOpacity: 0.95,
      customMenuBlur: 10,
      customMenuSaturation: 250,
      customMenuBrightness: 115,
      customMenuContrast: 145,
      customMenuBorderOpacity: 0.4,
      customMenuTextLightness: 100,
      customMenuHeadingLightness: 100,
      customControlBarOpacity: 0.85,
      customControlBarBlur: 8,
      customControlBarSaturation: 240,
      customControlBarBrightness: 115,
      customControlBarContrast: 140,
      customControlBarStyle: 'gradient',
      buttonShape: 'circle',
      customButtonSize: 46,
      customButtonSpacing: 14,
      customButtonBgOpacity: 0.25,
      customButtonBorderOpacity: 0.5,
      customButtonHoverBgOpacity: 0.45,
      customButtonTextLightness: 100,
    },
    pastel: {
      customHue: 330,
      customMenuOpacity: 0.75,
      customMenuBlur: 35,
      customMenuSaturation: 90,
      customMenuBrightness: 125,
      customMenuContrast: 90,
      customMenuBorderOpacity: 0.15,
      customMenuTextLightness: 20,
      customMenuHeadingLightness: 30,
      customControlBarOpacity: 0.65,
      customControlBarBlur: 25,
      customControlBarSaturation: 80,
      customControlBarBrightness: 125,
      customControlBarContrast: 90,
      customControlBarStyle: 'normal',
      buttonShape: 'circle',
      customButtonSize: 42,
      customButtonSpacing: 10,
      customButtonBgOpacity: 0.12,
      customButtonBorderOpacity: 0.2,
      customButtonHoverBgOpacity: 0.25,
      customButtonTextLightness: 20,
    },
    muted: {
      customHue: 0,
      customMenuOpacity: 0.85,
      customMenuBlur: 25,
      customMenuSaturation: 40,
      customMenuBrightness: 80,
      customMenuContrast: 110,
      customMenuBorderOpacity: 0.12,
      customMenuTextLightness: 80,
      customMenuHeadingLightness: 90,
      customControlBarOpacity: 0.75,
      customControlBarBlur: 20,
      customControlBarSaturation: 30,
      customControlBarBrightness: 85,
      customControlBarContrast: 110,
      customControlBarStyle: 'normal',
      buttonShape: 'square',
      customButtonSize: 40,
      customButtonSpacing: 12,
      customButtonBgOpacity: 0.08,
      customButtonBorderOpacity: 0.15,
      customButtonHoverBgOpacity: 0.18,
      customButtonTextLightness: 80,
    },
    neon: {
      customHue: 300,
      customMenuOpacity: 0.95,
      customMenuBlur: 5,
      customMenuSaturation: 280,
      customMenuBrightness: 130,
      customMenuContrast: 160,
      customMenuBorderOpacity: 0.6,
      customMenuTextLightness: 100,
      customMenuHeadingLightness: 100,
      customControlBarOpacity: 0.9,
      customControlBarBlur: 5,
      customControlBarSaturation: 270,
      customControlBarBrightness: 125,
      customControlBarContrast: 155,
      customControlBarStyle: 'gradient',
      buttonShape: 'square',
      customButtonSize: 48,
      customButtonSpacing: 16,
      customButtonBgOpacity: 0.3,
      customButtonBorderOpacity: 0.7,
      customButtonHoverBgOpacity: 0.5,
      customButtonTextLightness: 100,
    },
    minimal: {
      customHue: 0,
      customMenuOpacity: 0.5,
      customMenuBlur: 20,
      customMenuSaturation: 0,
      customMenuBrightness: 90,
      customMenuContrast: 100,
      customMenuBorderOpacity: 0.05,
      customMenuTextLightness: 90,
      customMenuHeadingLightness: 95,
      customControlBarOpacity: 0.4,
      customControlBarBlur: 15,
      customControlBarSaturation: 0,
      customControlBarBrightness: 90,
      customControlBarContrast: 100,
      customControlBarStyle: 'normal',
      buttonShape: 'circle',
      customButtonSize: 38,
      customButtonSpacing: 10,
      customButtonBgOpacity: 0.05,
      customButtonBorderOpacity: 0.1,
      customButtonHoverBgOpacity: 0.15,
      customButtonTextLightness: 90,
    },
  };
  
  const preset = presets[presetName];
  if (preset) {
    updateMultipleSettings(preset);
    populateSettingsPanel();
  }
}

/**
 * Apply ambiance preset (kept for legacy support)
 */
function applyPreset(presetName) {
  // Legacy function - can be removed if presets are fully replaced
  console.log('Preset applied:', presetName);
}

/**
 * Update ambiance controls (sliders) based on enabled state
 */
function updateAmbianceControls(enabled) {
  const panel = document.getElementById(SETTINGS_ID);
  if (!panel) return;
  
  const ambianceSliders = [
    'ambianceBlur',
    'ambianceOpacity',
    'ambianceSaturation',
    'ambianceHue'
  ];
  
  ambianceSliders.forEach(key => {
    const slider = panel.querySelector(`input[data-key="${key}"]`);
    const valueDisplay = slider?.parentElement?.querySelector('.cmu-slider-value');
    const ambianceBtn = document.querySelector('.cmu-ambiance-btn');
    
    if (slider) {
      slider.disabled = !enabled;
    }
    if (valueDisplay) {
      valueDisplay.classList.toggle('disabled', !enabled);
    }
    if (ambianceBtn) {
      ambianceBtn.classList.toggle('disabled', !enabled);
    }
  });
}

function handleSectionReset(sectionKey) {
  const keys = SECTION_RESET_CONFIG[sectionKey];
  if (!keys) return;

  const updates = {};
  for (const key of keys) {
    if (defaultSettings[key] !== undefined) {
      updates[key] = defaultSettings[key];
    }
  }

  if (sectionKey === 'video-playback') {
    setPlaybackSpeed(defaultSettings.playbackSpeed);
  } else if (Object.keys(updates).length > 0) {
    updateMultipleSettings(updates);
  }

  switch (sectionKey) {
    case 'ambiance': {
      const enabled = defaultSettings.ambianceEnabled;
      setIsAmbianceActive(enabled);
      if (enabled) {
        startAmbiance();
      } else {
        stopAmbiance();
      }
      updateAmbianceControls(enabled);
      break;
    }
    case 'video-transform': {
      if (activeVideo) {
        activeVideo.loop = defaultSettings.enableLoop;
      }
      applyVideoFlip();
      break;
    }
    case 'video-filters': {
      applyVideoFilters();
      break;
    }
    case 'video-playback': {
      updateSpeedButtons(defaultSettings.playbackSpeed);
      break;
    }
    case 'custom-theme': {
      if (settings.uiTheme !== 'custom') {
        updateSetting('uiTheme', 'custom');
      } else {
        applyDynamicStyles();
      }
      break;
    }
    default:
      break;
  }

  populateSettingsPanel();
}

/**
 * Video Control Functions
 */
function setPlaybackSpeed(speed) {
  if (!activeVideo) return;
  activeVideo.playbackRate = speed;
  updateSetting('playbackSpeed', speed);
}

function updateSpeedButtons(speed) {
  const panel = document.getElementById(SETTINGS_ID);
  if (!panel) return;
  
  panel.querySelectorAll('.cmu-speed-btn').forEach(btn => {
    const btnSpeed = parseFloat(btn.dataset.speed);
    btn.classList.toggle('active', Math.abs(btnSpeed - speed) < 0.01);
  });
}

function takeScreenshot() {
  if (!activeVideo) return;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = activeVideo.videoWidth;
    canvas.height = activeVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-screenshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (err) {
    console.error('Screenshot error:', err);
  }
}

function downloadVideo() {
  // Open YouTube download options (click the download button if available)
  const downloadBtn = document.querySelector('button[aria-label*="Download" i], button[aria-label*="Télécharger" i], .ytp-download-button, ytd-download-button-renderer button');
  if (downloadBtn) {
    downloadBtn.click();
  } else {
    // If no native download button, open in new tab with youtube-dl helper message
    const videoUrl = window.location.href;
    const message = encodeURIComponent(`To download this video, use a tool like:\n\n• yt-dlp: https://github.com/yt-dlp/yt-dlp\n• youtube-dl: https://youtube-dl.org/\n\nVideo URL:\n${videoUrl}`);
    
    // Try to trigger YouTube's download if user has Premium
    const moreBtnSelectors = ['button[aria-label="More actions"]', 'button[aria-label="Autres actions"]'];
    let moreBtnClicked = false;
    for (const selector of moreBtnSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.click();
            moreBtnClicked = true;
            break;
        }
    }

    if (moreBtnClicked) {
      setTimeout(() => {
        const downloadOption = document.querySelector('ytd-menu-service-item-renderer:has(yt-icon.ytd-menu-service-item-renderer[icon="download"])');
        if (downloadOption) {
          downloadOption.click();
        }
      }, 100);
    }
  }
}

function applyVideoFlip() {
  if (!activeVideo) return;
  
  const flipH = settings.flipHorizontal ? 'scaleX(-1)' : 'scaleX(1)';
  const flipV = settings.flipVertical ? 'scaleY(-1)' : 'scaleY(1)';
  
  activeVideo.style.transform = `${flipH} ${flipV}`;
}

function applyVideoFilters() {
  if (!activeVideo) return;
  
  const {
    videoBrightness = 100,
    videoContrast = 100,
    videoSaturation = 100,
    videoHueRotate = 0,
    videoBlur = 0,
    videoSepia = 0,
    videoGrayscale = 0,
    videoInvert = 0,
    videoAberration = 0
  } = settings;
  
  const filters = [
    `brightness(${videoBrightness}%)`,
    `contrast(${videoContrast}%)`,
    `saturate(${videoSaturation}%)`,
    `hue-rotate(${videoHueRotate}deg)`,
    `blur(${videoBlur}px)`,
    `sepia(${videoSepia}%)`,
    `grayscale(${videoGrayscale}%)`,
    `invert(${videoInvert}%)`
  ];

  const aberrationStrength = Math.max(0, Math.min(100, videoAberration));
  if (aberrationStrength > 0) {
    const offset = (aberrationStrength / 100) * 8;
    const blurRadius = (aberrationStrength / 100) * 4;
    filters.push(`drop-shadow(${offset.toFixed(2)}px 0 ${blurRadius.toFixed(2)}px rgba(255, 0, 128, 0.35))`);
    filters.push(`drop-shadow(${-offset.toFixed(2)}px 0 ${blurRadius.toFixed(2)}px rgba(0, 255, 255, 0.3))`);
  }
  
  activeVideo.style.filter = filters.join(' ');
}

/**
 * Detach all event listeners
 */
function detachEventListeners() {
  // Set transitioning flag to prevent volume OSD during deactivation
  isTransitioning = true;
  
  document.removeEventListener('keydown', keyHandler, true);
  document.removeEventListener('fullscreenchange', applyDynamicStyles);
  document.removeEventListener('mousemove', (e) => {
    if (isSeeking) seek(e);
  });
  document.removeEventListener('mouseup', () => setIsSeeking(false));
  
  if (activeVideo) {
    activeVideo.removeEventListener('timeupdate', updateUiState);
    activeVideo.removeEventListener('play', updateUiState);
    activeVideo.removeEventListener('pause', updateUiState);
    activeVideo.removeEventListener('volumechange', updateUiState);
  }
}


// 🎬 YOUTUBE LOGO - Clone and display YouTube logo



/**
 * Create and add YouTube logo to overlay
 */
function addYoutubeLogo() {
  // Wait for DOM to be ready
  setTimeout(() => {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    // Remove existing logo if any
    const existingLogo = document.getElementById(YOUTUBE_LOGO_ID);
    if (existingLogo) existingLogo.remove();

    // Find YouTube logo in the page - try multiple selectors
    const logoSelectors = [
      'ytd-topbar-logo-renderer yt-icon #logo-icon svg',
      'ytd-topbar-logo-renderer .yt-icon-shape svg',
      'yt-icon#logo-icon svg',
      '#logo-icon svg',
      'ytd-logo yt-icon svg',
      '.ytd-topbar-logo-renderer svg'
    ];

    let originalLogo = null;
    for (const selector of logoSelectors) {
      originalLogo = document.querySelector(selector);
      if (originalLogo) {
        console.log('Youtune: YouTube logo found with selector:', selector);
        break;
      }
    }

    if (!originalLogo) {
      console.warn('Youtune: YouTube logo not found on page');
      return;
    }

    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.id = YOUTUBE_LOGO_ID;

    // Clone the SVG directly
    const logoClone = originalLogo.cloneNode(true);
    logoClone.style.width = '120px';
    logoClone.style.height = 'auto';
    logoClone.style.cursor = 'pointer';
    logoClone.style.filter = 'brightness(1.2)';
    
    // Force white text color on all text paths
    const allPaths = logoClone.querySelectorAll('path');
    allPaths.forEach((path, index) => {
      // First 2 paths are the logo icon (red + white), rest is text
      if (index >= 2) {
        path.setAttribute('fill', 'white');
        path.style.fill = 'white';
      }
    });
    
    logoClone.onclick = () => {
      if (window.deactivateCinemaMode) window.deactivateCinemaMode();
    };

    logoContainer.appendChild(logoClone);
    overlay.appendChild(logoContainer);

    console.log('Youtune: YouTube logo added successfully');
    
    // Apply visibility based on settings
    updateYoutubeLogoVisibility();
  }, 300);
}

/**
 * Update YouTube logo visibility based on the current theme
 */
function updateYoutubeLogoVisibility() {
  const logo = document.getElementById(YOUTUBE_LOGO_ID);
  if (!logo) return;
  
  // Show logo only for YouTube theme, and ensure it's properly styled
  if (settings.uiTheme === 'youtube') {
    logo.style.display = 'block';
    logo.style.opacity = '1';
    logo.classList.remove('hidden');
  } else {
    logo.style.display = 'none';
    logo.style.opacity = '0';
    logo.classList.add('hidden');
  }
}

/**
 * Remove YouTube logo
 */
function removeYoutubeLogo() {
  const logo = document.getElementById(YOUTUBE_LOGO_ID);
  if (logo) logo.remove();
}




let isAudioModeActive = false;
let videoChangeWatcher = null;
let isEnabling = false; // Prevent double-click issues

/**
 * Sample dominant color from video or ambiance canvas
 */
function sampleDominantColor() {
  try {
    // Try to sample from ambiance canvas first
    const ambianceCanvas = document.getElementById('cmu-ambiance-canvas');
    if (ambianceCanvas) {
      const ctx = ambianceCanvas.getContext('2d');
      const imageData = ctx.getImageData(
        Math.floor(ambianceCanvas.width / 2),
        Math.floor(ambianceCanvas.height / 2),
        1, 1
      ).data;
      return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
    }
  } catch (e) {
    console.warn('[Youtune] Could not sample ambiance color:', e);
  }
  
  // Fallback to a nice default color
  return '#1a1a1a';
}

/**
 * Generate default cover with sampled color and music icon
 */
function generateDefaultCover() {
  const color = sampleDominantColor();
  const musicIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" opacity="0.6" width="120" height="120">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>`;
  
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="550" height="550">
    <rect width="550" height="550" fill="${encodeURIComponent(color)}"/>
    <g transform="translate(215, 215)">
      ${musicIcon}
    </g>
  </svg>`;
}
function toggleAudioMode(forceState = null) {
  // Simple toggle without lock - the async operations happen in background
  if (forceState !== null) {
    isAudioModeActive = forceState;
  } else {
    isAudioModeActive = !isAudioModeActive;
  }
  
  updateSetting('audioModeEnabled', isAudioModeActive);
  
  const overlay = document.getElementById('cmu-overlay');
  if (overlay) {
    overlay.classList.remove('audio-mode-active', 'cinema-mode-active');
    
    if (isAudioModeActive) {
      enableAudioMode(overlay);
    } else {
      disableAudioMode(overlay);
    }
  }
  
  console.log(`[Youtune] Audio mode ${isAudioModeActive ? 'enabled' : 'disabled'}`);
  return isAudioModeActive;
}

async function enableAudioMode(overlay) {
  const video = overlay.querySelector('video');
  if (video) {
    video.style.transition = 'opacity 0.3s ease';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';
    video.style.willChange = 'opacity';
  }
  
  // Background: black if ambiance disabled, otherwise keep ambiance
  if (settings.ambianceEnabled) {
    overlay.style.transition = 'background 0.5s ease';
    // Keep ambiance background (it will be applied by ambiance.js)
  } else {
    overlay.style.transition = 'background 0.5s ease';
    overlay.style.background = 'rgb(0, 0, 0)';
  }
  
  overlay.classList.add('audio-mode-active');
  
  overlay.style.willChange = 'background';
  setTimeout(() => overlay.style.willChange = 'auto', 600);
  
  // Create audio mode UI with title and cover
  createAudioModeUI(overlay);
  
  // Extract and display video info
  const videoInfo = await extractVideoInfo();
  updateAudioModeUI(videoInfo);
  
  // Start watching for video changes
  startVideoChangeWatcher();
}

function disableAudioMode(overlay) {
  const video = overlay.querySelector('video');
  if (video) {
    video.style.transition = 'opacity 0.3s ease';
    video.style.opacity = '1';
    video.style.pointerEvents = 'auto';
    video.style.willChange = 'auto';
  }
  
  overlay.style.transition = 'background 0.5s ease';
  overlay.style.background = 'rgb(0,0,0)';
  overlay.classList.remove('audio-mode-active');
  
  overlay.style.willChange = 'background';
  setTimeout(() => overlay.style.willChange = 'auto', 600);
  
  // Remove audio mode UI
  const audioContainer = overlay.querySelector('#cmu-audio-container');
  if (audioContainer) {
    audioContainer.remove();
  }
  
  // Stop watching for video changes
  stopVideoChangeWatcher();
  
  // CLEAR CACHE completely when exiting audio mode
  console.log('[Youtune] Clearing cache on audio mode exit');
  localStorage.removeItem('youtune_video_cache');
}

function createAudioModeUI(overlay) {
  // Remove existing if any
  const existing = overlay.querySelector('#cmu-audio-container');
  if (existing) existing.remove();
  
  const container = document.createElement('div');
  container.id = 'cmu-audio-container';
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 60px;
    z-index: 5;
    pointer-events: none;
  `;
  
  // Title and artist container (at top, higher position with fixed height)
  const infoContainer = document.createElement('div');
  infoContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 900px;
    z-index: 8;
    height: 140px;
    overflow: hidden;
  `;
  
  // Title (with text truncation to prevent overflow)
  const title = document.createElement('h2');
  title.id = 'cmu-audio-title';
  title.style.cssText = `
    margin: 0;
    padding: 0 20px;
    font-size: 36px;
    font-weight: 700;
    color: white;
    text-shadow: 0 4px 30px rgba(0,0,0,0.7);
    text-align: center;
    width: 100%;
    max-width: 900px;
    line-height: 1.2;
    max-height: 86px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-word;
  `;
  title.textContent = 'Loading...';
  
  // Artist
  const artist = document.createElement('p');
  artist.id = 'cmu-audio-artist';
  artist.style.cssText = `
    margin: 0;
    padding: 0 20px;
    font-size: 22px;
    font-weight: 400;
    color: rgba(255,255,255,0.8);
    text-shadow: 0 2px 15px rgba(0,0,0,0.6);
    text-align: center;
    width: 100%;
    max-width: 900px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
  artist.textContent = 'Unknown Artist';
  
  infoContainer.appendChild(title);
  infoContainer.appendChild(artist);
  
  // Cover image (centered, larger, with proper drop shadow like video)
  const coverImg = document.createElement('img');
  coverImg.id = 'cmu-audio-cover';
  coverImg.style.cssText = `
    width: 550px;
    height: 550px;
    border-radius: 24px;
    object-fit: cover;
    filter: drop-shadow(${settings.videoShadowX || 0}px ${settings.videoShadowY || 20}px ${settings.videoShadowBlur || 40}px rgba(0,0,0,${settings.videoShadowOpacity || 0.6}));
    transition: opacity 0.3s ease;
    z-index: 6;
    opacity: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  `;
  // Start hidden - will fade in when real image loads
  coverImg.src = '';
  
  container.appendChild(infoContainer);
  container.appendChild(coverImg);
  overlay.appendChild(container);
}

async function extractVideoInfo(forceRefresh = false) {
  // Get video ID
  const videoId = new URLSearchParams(window.location.search).get('v');
  
  // Try cache first ONLY if not forced refresh
  if (videoId && !forceRefresh) {
    const cached = getCachedVideoInfo(videoId);
    if (cached) {
      console.log('[Youtune] Using cached video info for', videoId);
      return cached;
    }
  }
  
  console.log('[Youtube] Fetching fresh video info' + (forceRefresh ? ' (forced refresh)' : ''));
  
  // Get video title
  const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                  document.querySelector('.title.style-scope.ytd-video-primary-info-renderer');
  const title = titleEl?.textContent?.trim() || 'Unknown Title';
  
  // Get channel name (artist)
  const artistEl = document.querySelector('ytd-channel-name a') ||
                   document.querySelector('#owner-name a');
  const artist = artistEl?.textContent?.trim() || 'Unknown Artist';
  
  // Try to get album art from iTunes/Apple Music API
  let thumbnail = await getItunesAlbumArt(artist, title);
  
  // Fallback 1: Use YouTube thumbnail if iTunes fails
  if (!thumbnail && videoId) {
    console.log('[Youtune] iTunes API failed, trying YouTube thumbnail');
    thumbnail = getYoutubeThumbnail(videoId);
  }
  
  // Fallback 2: Try to get thumbnail from page meta tags
  if (!thumbnail) {
    const metaThumb = document.querySelector('meta[property="og:image"]')?.content;
    if (metaThumb) {
      console.log('[Youtune] Using meta tag thumbnail');
      thumbnail = metaThumb;
    }
  }
  
  // Final fallback: solid color gradient (no SVG icon)
  if (!thumbnail) {
    console.log('[Youtune] All thumbnail sources failed, using gradient');
    thumbnail = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="550" height="550"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%231a1a1a"/><stop offset="100%" style="stop-color:%232d2d2d"/></linearGradient></defs><rect width="550" height="550" fill="url(%23g)"/></svg>';
  }
  
  const videoInfo = { title, artist, thumbnail };
  
  // Save to cache
  if (videoId) {
    setCachedVideoInfo(videoId, videoInfo);
  }
  
  return videoInfo;
}

function getYoutubeThumbnail(videoId) {
  // Try maxresdefault first (1920x1080), fallback to hqdefault (480x360)
  // We'll return maxresdefault and let onerror handle fallback in updateAudioModeUI
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

async function getItunesAlbumArt(artist, title) {
  try {
    // Clean up the search query (remove common YouTube suffixes)
    const cleanTitle = title
      .replace(/\(Official.*?\)/gi, '')
      .replace(/\[Official.*?\]/gi, '')
      .replace(/\(Audio\)/gi, '')
      .replace(/\(Video\)/gi, '')
      .replace(/\(Lyric.*?\)/gi, '')
      .replace(/\(Music Video\)/gi, '')
      .trim();
    
    const query = encodeURIComponent(`${artist} ${cleanTitle}`);
    const response = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`);
    
    if (!response.ok) {
      console.log('[Youtune] iTunes API request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get the highest quality artwork (replace 100x100 with 600x600)
      const artworkUrl = data.results[0].artworkUrl100;
      if (artworkUrl) {
        const highResArtwork = artworkUrl.replace('100x100', '600x600');
        console.log('[Youtune] iTunes album art found:', highResArtwork);
        return highResArtwork;
      }
    }
    
    console.log('[Youtune] No iTunes results for:', artist, '-', cleanTitle);
    return null;
  } catch (error) {
    console.error('[Youtune] iTunes API error:', error);
    return null;
  }
}

function updateAudioModeUI(videoInfo) {
  console.log('[Youtune] Updating UI with:', videoInfo);
  
  const coverImg = document.getElementById('cmu-audio-cover');
  const titleEl = document.getElementById('cmu-audio-title');
  const artistEl = document.getElementById('cmu-audio-artist');
  
  // Update title and artist immediately
  if (titleEl) {
    titleEl.style.opacity = '0.5';
    titleEl.textContent = videoInfo.title;
    setTimeout(() => {
      titleEl.style.opacity = '1';
    }, 100);
  }
  
  if (artistEl) {
    artistEl.style.opacity = '0.5';
    artistEl.textContent = videoInfo.artist;
    setTimeout(() => {
      artistEl.style.opacity = '1';
    }, 100);
  }
  
  // Preload and update cover image
  if (coverImg && videoInfo.thumbnail) {
    // Fade out current cover
    coverImg.style.opacity = '0';
    
    // Preload new image with fallback chain
    const preloadImg = new Image();
    preloadImg.onload = () => {
      console.log('[Youtune] Cover image loaded successfully');
      coverImg.src = videoInfo.thumbnail;
      coverImg.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        coverImg.style.opacity = '1';
      }, 50);
    };
    preloadImg.onerror = () => {
      console.log('[Youtune] Primary cover failed, trying fallback');
      // If maxresdefault fails, try hqdefault
      const videoId = new URLSearchParams(window.location.search).get('v');
      if (videoId && videoInfo.thumbnail.includes('maxresdefault')) {
        const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          console.log('[Youtune] Fallback thumbnail loaded');
          coverImg.src = fallbackUrl;
          coverImg.style.opacity = '1';
        };
        fallbackImg.onerror = () => {
          console.log('[Youtune] All thumbnails failed, using default cover with music icon');
          coverImg.src = generateDefaultCover();
          coverImg.style.opacity = '1';
        };
        fallbackImg.src = fallbackUrl;
      } else {
        // Use default cover with music icon
        coverImg.src = generateDefaultCover();
        coverImg.style.opacity = '1';
      }
    };
    // Start loading
    preloadImg.src = videoInfo.thumbnail;
  }
}

function startVideoChangeWatcher() {
  // Stop existing watcher if any
  stopVideoChangeWatcher();
  
  let lastUrl = window.location.href;
  let lastVideoId = new URLSearchParams(window.location.search).get('v');
  let retryCount = 0;
  const MAX_RETRIES = 3;
  
  videoChangeWatcher = setInterval(async () => {
    const currentUrl = window.location.href;
    const currentVideoId = new URLSearchParams(window.location.search).get('v');
    
    // Check if audio mode container still exists
    const audioContainer = document.getElementById('cmu-audio-container');
    if (!audioContainer) {
      console.log('[Youtune] Audio container removed, stopping watcher');
      stopVideoChangeWatcher();
      return;
    }
    
    // Check both URL and video ID for better detection
    if ((currentUrl !== lastUrl || currentVideoId !== lastVideoId) && currentVideoId) {
      lastUrl = currentUrl;
      lastVideoId = currentVideoId;
      retryCount = 0; // Reset retry count on new video
      console.log('[Youtune] Video changed detected! New ID:', currentVideoId);
      
      // Show loading state immediately
      const titleEl = document.getElementById('cmu-audio-title');
      const artistEl = document.getElementById('cmu-audio-artist');
      const coverImg = document.getElementById('cmu-audio-cover');
      
      if (!titleEl || !artistEl || !coverImg) {
        console.warn('[Youtune] Audio mode elements not found, stopping watcher');
        stopVideoChangeWatcher();
        return;
      }
      
      titleEl.textContent = 'Loading...';
      titleEl.style.opacity = '0.5';
      artistEl.textContent = 'Please wait...';
      artistEl.style.opacity = '0.5';
      coverImg.style.opacity = '0.3';
      
      // Wait for YouTube to load new video info
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Try extraction with retry logic
      let videoInfo = null;
      while (retryCount < MAX_RETRIES && !videoInfo) {
        console.log(`[Youtune] Extracting video info (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        videoInfo = await extractVideoInfo(true); // Force refresh = true
        
        // Check if we got valid info
        if (videoInfo && videoInfo.title !== 'Unknown Title') {
          console.log('[Youtune] Video info extracted:', videoInfo);
          break;
        }
        
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log('[Youtube] Retrying in 800ms...');
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      if (videoInfo) {
        // Force update UI
        updateAudioModeUI(videoInfo);
      } else {
        console.error('[Youtune] Failed to extract video info after', MAX_RETRIES, 'attempts');
        titleEl.textContent = 'Error loading video info';
        titleEl.style.opacity = '1';
        artistEl.textContent = 'Please try again';
        artistEl.style.opacity = '1';
      }
    }
  }, 400); // Check every 400ms
  
  console.log('[Youtune] Video change watcher started');
}

function stopVideoChangeWatcher() {
  if (videoChangeWatcher) {
    clearInterval(videoChangeWatcher);
    videoChangeWatcher = null;
  }
}
function isAudioModeEnabled() {
  return isAudioModeActive;
}
function initAudioMode() {
  isAudioModeActive = settings.audioModeEnabled || false;
}


// 🚀 MAIN ENTRY POINT - Cinema Mode Activation













/**
 * Show notification to user
 */
function showNotification(message, icon = 'ℹ️') {
  console.log(`${icon} ${message}`);
}

/**
 * Toggle Cinema Mode on/off
 */
window.toggleCinemaMode = async function() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    deactivateCinemaMode();
  } else {
    await loadSettings();
    const video = findBestVideo();
    if (video) {
      activateCinemaMode(video);
    } else {
      showNotification('Aucune vidéo compatible trouvée', '❌');
    }
  }
};

/**
 * Activate Cinema Mode
 */
async function activateCinemaMode(video) {
  setActiveVideo(video);
  saveOriginalState(video);
  document.documentElement.classList.add('cmu-no-scroll');
  
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    backgroundColor: 'rgb(0,0,0)', zIndex: '2147483647',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', userSelect: 'none', cursor: 'default',
    opacity: '0', transition: 'opacity 0.3s ease'
  });
  
  const ambianceCanvas = document.createElement('canvas');
  ambianceCanvas.id = 'cmu-ambiance-canvas';
  overlay.prepend(ambianceCanvas);
  
  video.classList.add(ACTIVE_VIDEO_CLASS);
  
  // Apply video styles - keep video visible, no hiding tricks
  video.style.borderRadius = `${settings.videoBorderRadius}px`;
  video.style.maxWidth = `${settings.videoMaxSize}vw`;
  video.style.maxHeight = `${settings.videoMaxSize}vh`;
  video.style.boxShadow = `${settings.videoShadowX}px ${settings.videoShadowY}px ${settings.videoShadowBlur}px rgba(0,0,0,${settings.videoShadowOpacity})`;
  video.style.zIndex = '2';
  video.style.position = 'relative';
  video.style.objectFit = 'contain';
  video.style.transition = 'opacity 0.3s ease';
  
  overlay.appendChild(video);
  
  const isShorts = window.location.pathname.includes('/shorts/');
  if (!isShorts) {
    overlay.appendChild(createControls());
    overlay.appendChild(createSettingsPanel());
  } else {
    overlay.appendChild(createShortsControls());
  }
  
  overlay.appendChild(createInteractionOSD('playpause'));
  overlay.appendChild(createInteractionOSD('volume'));
  overlay.appendChild(createInteractionOSD('skip'));
  document.body.appendChild(overlay);
  
  // Fade in overlay smoothly
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });
  
  await loadSettings();
  injectStyles();
  applyDynamicStyles();
  attachEventListeners();
  updateUiState();
  addYoutubeLogo();
  setIsAmbianceActive(settings.ambianceEnabled);
  if (isAmbianceActive) startAmbiance();
  
  // NO AUDIO MODE - Removed as per user request
  
  const observer = new MutationObserver(debounce(handlePageMutation, 150)); // Reduced from 300ms for faster detection
  observer.observe(document.body, { childList: true, subtree: true });
  setPageObserver(observer);
  
  try {
    chrome.runtime.sendMessage({ action: 'cinemaActivated' });
  } catch (e) {
    // Silent: This is normal after extension reload
  }
}

/**
 * Deactivate Cinema Mode
 */
function deactivateCinemaMode() {
  stopAmbiance();
  removeYoutubeLogo();
  if (pageObserver) {
    pageObserver.disconnect();
    setPageObserver(null);
  }
  detachEventListeners();
  clearTimeout(uiHideTimeout);
  clearTimeout(interactionOSDTimeout);
  clearTimeout(volumeOSDTimeout);
  clearTimeout(skipOSDTimeout);
  clearTimeout(clickTimeout);
  
  // Simple fade out before removing
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay && activeVideo) {
    // Fade out overlay smoothly
    overlay.style.transition = 'opacity 0.25s ease';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      document.documentElement.classList.remove('cmu-no-scroll');
      document.body.style.cursor = 'default';
      if (activeVideo) restoreOriginalState(activeVideo);
      
      if (overlay) {
        while (overlay.firstChild) {
          overlay.removeChild(overlay.firstChild);
        }
        overlay.remove();
      }
      const styles = document.getElementById(STYLES_ID);
      if (styles) styles.remove();
      setActiveVideo(null);
      try {
        chrome.runtime.sendMessage({ action: 'cinemaDeactivated' });
      } catch (e) {
        // Silent: This is normal after extension reload
      }
    }, 250); // Increased from 150ms for smoother exit
  } else {
    document.documentElement.classList.remove('cmu-no-scroll');
    document.body.style.cursor = 'default';
    if (activeVideo) restoreOriginalState(activeVideo);
    if (overlay) {
      while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
      }
      overlay.remove();
    }
    const styles = document.getElementById(STYLES_ID);
    if (styles) styles.remove();
    setActiveVideo(null);
    try {
      chrome.runtime.sendMessage({ action: 'cinemaDeactivated' });
    } catch (e) {
      // Silent: This is normal after extension reload
    }
  }
}

// Variable to track if we're currently transitioning
let isTransitioningVideo = false;

/**
 * Handle page mutations (for Shorts navigation and video changes)
 */
function handlePageMutation() {
  if (!activeVideo || !activeVideo.isConnected) {
    deactivateCinemaMode();
    return;
  }
  
  // Handle both Shorts and regular video navigation
  const bestVideo = findBestVideo();
  if (bestVideo && bestVideo !== activeVideo && !isTransitioningVideo) {
    isTransitioningVideo = true;
    console.log('[Youtune] Video change detected, starting smooth transition');
    
    const overlay = document.getElementById(OVERLAY_ID);
    const oldVideo = activeVideo;
    
    // Prepare new video FIRST with all styles and opacity 0
    bestVideo.classList.add(ACTIVE_VIDEO_CLASS);
    bestVideo.style.borderRadius = `${settings.videoBorderRadius}px`;
    bestVideo.style.maxWidth = `${settings.videoMaxSize}vw`;
    bestVideo.style.maxHeight = `${settings.videoMaxSize}vh`;
    bestVideo.style.boxShadow = `${settings.videoShadowX}px ${settings.videoShadowY}px ${settings.videoShadowBlur}px rgba(0,0,0,${settings.videoShadowOpacity})`;
    bestVideo.style.zIndex = '1'; // Behind old video
    bestVideo.style.position = 'relative';
    bestVideo.style.objectFit = 'contain';
    bestVideo.style.opacity = '0';
    bestVideo.style.transition = 'opacity 0.4s ease';
    
    // Add new video to overlay (behind old one)
    overlay.appendChild(bestVideo);
    
    // Wait for new video to be ready
    const startTransition = () => {
      console.log('[Youtune] New video ready, starting crossfade');
      
      // Crossfade: fade out old, fade in new
      if (oldVideo && oldVideo.isConnected) {
        oldVideo.style.transition = 'opacity 0.4s ease';
        oldVideo.style.opacity = '0';
      }
      
      requestAnimationFrame(() => {
        bestVideo.style.opacity = '1';
        bestVideo.style.zIndex = '2'; // Bring to front
      });
      
      // After transition, remove old video
      setTimeout(() => {
        if (oldVideo && oldVideo.isConnected) {
          restoreOriginalState(oldVideo);
          console.log('[Youtune] Old video removed after crossfade');
        }
        isTransitioningVideo = false;
      }, 400);
    };
    
    // Check if video is ready
    if (bestVideo.readyState >= 2) {
      startTransition();
    } else {
      bestVideo.addEventListener('loadeddata', startTransition, { once: true });
      // Fallback timeout
      setTimeout(() => {
        if (isTransitioningVideo) {
          console.log('[Youtune] Fallback: forcing transition');
          startTransition();
        }
      }, 800);
    }
    
    setActiveVideo(bestVideo);
    saveOriginalState(bestVideo);
    
    applyDynamicStyles();
    updateUiState();
  }
}

window.deactivateCinemaMode = deactivateCinemaMode;

// 🎬 Add Lumen button to YouTube native player controls
function addLumenControlButton() {
  setTimeout(() => {
    const controls = document.querySelector(".ytp-right-controls");
    if (controls && !document.getElementById("lumen-control-btn")) {
      const button = document.createElement("button");
      button.id = "lumen-control-btn";
      button.className = "ytp-button";
      button.title = "Lumen Cinema Mode (Ctrl+Shift+L)";
      button.setAttribute('aria-label', 'Lumen Cinema Mode');
      button.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="pointer-events: none;">
        <path d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6m0-2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"/>
      </svg>`;
      button.style.cssText = "opacity: 0.9; transition: opacity 0.2s;";
      
      button.onclick = (e) => {
        e.stopPropagation();
        window.toggleCinemaMode();
      };
      
      button.onmouseenter = () => {
        button.style.opacity = "1";
      };
      
      button.onmouseleave = () => {
        button.style.opacity = "0.9";
      };
      
      const fullscreenBtn = controls.querySelector(".ytp-fullscreen-button");
      if (fullscreenBtn && fullscreenBtn.parentNode === controls) {
        try {
          controls.insertBefore(button, fullscreenBtn);
        } catch (e) {
          controls.appendChild(button);
        }
      } else {
        controls.appendChild(button);
      }
      
      console.log("[Lumen] Control button added to YouTube player");
    }
  }, 1000);
}

// Initialize button addition
function initLumenButton() {
  if (window.location.pathname === "/watch") {
    addLumenControlButton();
  }
}

// Watch for YouTube navigation
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    setTimeout(initLumenButton, 500);
  }
}).observe(document, { subtree: true, childList: true });

// Periodically check if button needs to be added
setInterval(() => {
  if (window.location.pathname === "/watch" && !document.getElementById("lumen-control-btn")) {
    const controls = document.querySelector(".ytp-right-controls");
    if (controls) {
      addLumenControlButton();
    }
  }
}, 5000);

// Initialize on load
loadSettings().then(() => {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'toggleCinemaMode') {
      window.toggleCinemaMode();
    }
  });
  
  // Initialize button on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLumenButton);
  } else {
    initLumenButton();
  }
  
  setTimeout(initLumenButton, 1000);
});

})();
