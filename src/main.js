import { initAppRoot } from "./core/appRoot.js";
import { createInitialState } from "./core/stateStore.js";

const rootElement = document.getElementById("app-root");
const initialState = createInitialState();

initAppRoot(rootElement, { initialState });