# Chrome Web Store - Permission Justifications

## Required by Chrome Web Store Submission

When submitting MusicTab, you will need to provide justifications for each permission. Copy and paste the text below into the corresponding fields.

---

## 📦 Storage Permission Justification

**Permission:** `storage`

**Justification:**
```
The storage permission is required to save user preferences and settings locally on the user's device. This includes:
- Audio player settings (volume, playback mode, equalizer settings)
- User-created playlists and their order
- Theme and UI customization preferences
- Recently played tracks list
- User's preferred metadata display options

All data is stored locally using chrome.storage.local API and never leaves the user's device. No data is transmitted to any external server.
```

---

## 🗂️ Tabs Permission Justification

**Permission:** `tabs`

**Justification:**
```
The tabs permission is required to enable the extension's core functionality:
- Opening the music player interface in a new tab when the user clicks the extension icon
- Managing the player tab lifecycle (closing, focusing)
- Detecting when the user closes the player tab to properly clean up resources

This permission does NOT access tab content, URLs, or browsing history. It is only used to create and manage the music player tab itself.
```

---

## 🌐 Host Permission Justification

**Permission:** `https://itunes.apple.com/*`

**Justification:**
```
This host permission allows the extension to fetch public metadata for music files:
- Album cover artwork
- Track information and release dates
- Artist information

When a user plays a local music file, the extension reads the song title and artist from the file's ID3 tags and queries the iTunes public API to retrieve album artwork. Only the song/artist name is sent - no user data or file content is transmitted. This enhances the user experience by displaying beautiful album covers instead of generic placeholders.
```

---

**Permission:** `https://en.wikipedia.org/*` and `https://*.wikipedia.org/*`

**Justification:**
```
This host permission allows the extension to fetch public artist information:
- Artist photos and biography
- Career information and discography
- Related artist details

The extension queries Wikipedia's public API using only the artist name (extracted from the music file's metadata) to display artist photos and information alongside the music player. No personal user data is transmitted. This provides users with a richer music listening experience by showing artist visuals and context.
```

---

## 📋 Complete Privacy Policy URL

For the "Privacy Policy" field, use:

```
https://github.com/bwalid13/musictab/blob/main/PRIVACY_POLICY.md
```

OR paste the full privacy policy text directly into the field.

---

## ✅ Single Field Justification (If Requested)

If Chrome Web Store asks for a single combined justification, use this:

```
MusicTab is a local music player that requires minimal permissions to function:

1. STORAGE: Save user preferences, playlists, and settings locally on the device. No data is transmitted externally.

2. TABS: Open and manage the music player tab when users click the extension icon. Does not access browsing history or tab content.

3. ITUNES.APPLE.COM & WIKIPEDIA.ORG: Fetch public metadata (album covers, artist photos) using only song/artist names from file ID3 tags. Enhances user experience with visual content. No personal data or file content is transmitted.

All music files remain on the user's device. The extension processes audio locally and only makes public API requests for metadata display purposes.
```

---

## 📧 Support Email

**Email:** bwalid13@gmail.com

---

## 🔗 Developer Website/Support URL (Optional)

```
https://github.com/bwalid13/musictab
```

---

## 💡 Tips for Submission

1. Be specific about what each permission does
2. Explain why it's necessary for core functionality
3. Emphasize user privacy and local processing
4. Mention that no personal data is collected
5. Keep answers clear and concise

---

**Note:** Chrome Web Store reviewers look for honest, clear explanations. These justifications accurately describe MusicTab's functionality and respect for user privacy.
