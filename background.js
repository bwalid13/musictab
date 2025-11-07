// MusicTab - Local MP3 Player Extension
// Robust service worker for tab toggle via toolbar icon

/**
 * Toggle MusicTab player tab on icon click.
 * Behavior:
 * - If a player tab exists and is active in the focused window: close it.
 * - If a player tab exists but isn't active: focus its window and activate the tab.
 * - If none exists: create a new tab.
 * This survives service worker restarts by querying rather than relying on state.
 */
chrome.action.onClicked.addListener(async () => {
  try {
    const url = chrome.runtime.getURL('player.html');

    // Find any existing player tab(s)
    const tabs = await chrome.tabs.query({ url });

    if (tabs && tabs.length > 0) {
      // Prefer a tab in the current window if possible
      const [currentWindow] = await chrome.windows.getAll({ populate: false, windowTypes: ['normal'] });
      let candidate = tabs.find(t => t.active && t.highlighted) || tabs[0];

      // If the tab is active in its window and that window is focused, treat as toggle -> close
      const win = candidate.windowId ? await chrome.windows.get(candidate.windowId) : null;
      const isFocusedActive = !!candidate.active && !!(win && win.focused);

      if (isFocusedActive) {
        await chrome.tabs.remove(candidate.id);
        console.log('[MusicTab] Player tab closed');
        return;
      } else {
        // Focus and activate
        if (candidate.windowId) await chrome.windows.update(candidate.windowId, { focused: true });
        await chrome.tabs.update(candidate.id, { active: true });
        console.log('[MusicTab] Player tab focused');
        return;
      }
    }

    // No existing tab -> create
    const created = await chrome.tabs.create({ url, active: true });
    console.log('[MusicTab] Player tab opened:', created.id);
  } catch (error) {
    console.error('[MusicTab] Error toggling tab:', error);
  }
});