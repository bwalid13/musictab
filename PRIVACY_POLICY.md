# Privacy Policy for MusicTab

**Last Updated:** November 7, 2025

---

## Overview

MusicTab is a local music player extension that respects your privacy. Your music files and personal data never leave your device.

---

## Data Collection

**MusicTab does NOT collect, store, or transmit any personal user data.**

We do not:
- ❌ Upload your music files
- ❌ Track your listening habits
- ❌ Collect personal information
- ❌ Use analytics or tracking services
- ❌ Display advertisements
- ❌ Share data with third parties

---

## Local Processing

All audio files are processed **locally on your device**. 

- Your music files are read directly from your computer
- Playback happens entirely in your browser
- No files are ever uploaded to any server
- All processing is done client-side

---

## External API Requests

The extension may fetch **public metadata only** from these sources:

### iTunes API (`https://itunes.apple.com`)
- **Purpose:** Fetch album artwork and track metadata
- **Data Sent:** Song title and artist name (from your file's ID3 tags)
- **Data Received:** Album cover images, artist information
- **Privacy:** Only song/artist names are sent, no personal data

### Wikipedia API (`https://*.wikipedia.org`)
- **Purpose:** Fetch artist photos and biographical information
- **Data Sent:** Artist name only
- **Data Received:** Public artist information and images
- **Privacy:** Only artist names are sent, no personal data

These requests are made only when you play a song and only contain the metadata already embedded in your music files.

---

## Local Storage

The extension uses **Chrome's local storage** to save:
- Your preferences and settings
- Your custom playlists
- Interface customization options

This data is stored **only on your device** and is never transmitted anywhere.

---

## Permissions Justification

MusicTab requests the following permissions:

### `storage`
- **Why:** To save your settings and preferences locally on your device
- **Privacy:** Data stays on your computer only

### `tabs`
- **Why:** To open the music player in a new tab when you click the extension icon
- **Privacy:** No tab data is collected or transmitted

### `https://itunes.apple.com/*`
- **Why:** To fetch album artwork and metadata from iTunes
- **Privacy:** Only song/artist names are sent

### `https://*.wikipedia.org/*`
- **Why:** To fetch artist information and photos
- **Privacy:** Only artist names are sent

---

## Third-Party Services

MusicTab does **NOT** use:
- Analytics services (Google Analytics, etc.)
- Advertising networks
- Tracking pixels
- Social media integrations
- Any other third-party data collection services

---

## Your Control

You have full control over your data:
- All your music files remain on your computer
- You can disable metadata fetching in the settings
- You can clear all stored settings at any time
- You can uninstall the extension to remove all local data

---

## Children's Privacy

MusicTab does not knowingly collect any information from children or anyone else. The extension is designed to work entirely locally without data collection.

---

## Changes to This Policy

We may update this privacy policy from time to time. The "Last Updated" date at the top will be changed when updates occur. Continued use of the extension after changes constitutes acceptance of the updated policy.

---

## Contact

If you have questions or concerns about this privacy policy or MusicTab's privacy practices, please contact:

**Email:** bwalid13@gmail.com  
**GitHub:** https://github.com/bwalid13

---

## Summary

**TL;DR:** 
- ✅ Your music stays on your computer
- ✅ No data collection or tracking
- ✅ Only public metadata requests (album art, artist info)
- ✅ All settings stored locally only
- ✅ No ads, no analytics, no third parties

**Your privacy is our priority.**
