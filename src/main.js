import { initAppRoot } from "./core/appRoot.js";
import { createInitialState } from "./core/stateStore.js";
import { loadState, saveState } from "./core/persistence.js";

const rootElement = document.getElementById("app-root");
const initialState = loadState() || createInitialState();

const app = initAppRoot(rootElement, { initialState });

// Auto-save on state changes
app.store.subscribe((state) => {
  saveState(state);
});