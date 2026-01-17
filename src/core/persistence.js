const STORAGE_KEY = "promptcraft_v0_state";

export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Failed to save state:", err);
  }
}

export function loadState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.error("Failed to load state:", err);
    return null;
  }
}