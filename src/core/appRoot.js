import { createStateStore } from "./stateStore.js";
import { createEventBus } from "./eventBus.js";
import { createRootLayout } from "../ui/layout/createRootLayout.js";

export function initAppRoot(rootElement, { initialState }) {
  const store = createStateStore(initialState);
  const bus = createEventBus();

  const services = {
    store,
    bus,
  };

  const layout = createRootLayout(services);

  rootElement.innerHTML = "";
  rootElement.appendChild(layout.rootElement);
}