import { createPromptWorkspacePanel } from "../panels/promptWorkspacePanel.js";
import { createMetaRulesPanel } from "../panels/metaRulesPanel.js";
import { createHistoryPanel } from "../panels/historyPanel.js";

export function createMainColumns(services) {
  const rootElement = document.createElement("section");
  rootElement.className = "app-shell__main main-grid";

  const workspacePanel = createPromptWorkspacePanel(services);
  const rulesPanel = createMetaRulesPanel(services);
  const historyPanel = createHistoryPanel(services);

  rootElement.appendChild(workspacePanel.rootElement);
  rootElement.appendChild(rulesPanel.rootElement);
  rootElement.appendChild(historyPanel.rootElement);

  return {
    rootElement,
    workspacePanel,
    rulesPanel,
    historyPanel,
  };
}