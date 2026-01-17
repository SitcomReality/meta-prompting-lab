import { createControlPanel } from "../panels/controlPanel.js";
import { createAgentMindsPanel } from "../panels/agentMindsPanel.js";
import { createHistoryPanel } from "../panels/historyPanel.js";

export function createMainColumns(services) {
  const rootElement = document.createElement("section");
  rootElement.className = "app-shell__main main-grid";

  // Re-organizing the layout to be more logical for multi-agent simulation
  const controlPanel = createControlPanel(services);
  const mindsPanel = createAgentMindsPanel(services);
  const historyPanel = createHistoryPanel(services);

  rootElement.appendChild(controlPanel.rootElement);
  rootElement.appendChild(mindsPanel.rootElement);
  rootElement.appendChild(historyPanel.rootElement);

  return {
    rootElement,
    controlPanel,
    mindsPanel,
    historyPanel,
  };
}