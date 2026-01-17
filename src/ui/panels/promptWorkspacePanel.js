import { createPrimaryButton } from "../tools/primaryButton.js";
import { executeTurn } from "../../core/gameLoop.js";

export function createPromptWorkspacePanel(services) {
  const { store } = services;
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--primary panel--workspace";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Agent Configuration";

  const body = document.createElement("div");
  body.className = "panel__body panel-workspace";

  const gameStateLabel = document.createElement("label");
  gameStateLabel.className = "field-label";
  gameStateLabel.textContent = "Game State / Context";

  const gameStateInput = document.createElement("textarea");
  gameStateInput.className = "field-input field-input--multiline";
  gameStateInput.value = store.getState().gameState;
  gameStateInput.addEventListener("input", (e) => {
    store.setState({ gameState: e.target.value });
  });

  const agentLabel = document.createElement("label");
  agentLabel.className = "field-label";
  agentLabel.textContent = "Active Agent Strategy";

  const strategyInput = document.createElement("textarea");
  strategyInput.className = "field-input field-input--multiline";
  strategyInput.style.flex = "1";
  strategyInput.value = store.getState().agents[0].strategyPrompt;
  
  // Update strategy input when state changes (e.g. from self-modification)
  store.subscribe((state) => {
    if (document.activeElement !== strategyInput) {
      strategyInput.value = state.agents[0].strategyPrompt;
    }
  });

  strategyInput.addEventListener("input", (e) => {
    const state = store.getState();
    const updatedAgents = [...state.agents];
    updatedAgents[0] = { ...updatedAgents[0], strategyPrompt: e.target.value };
    store.setState({ agents: updatedAgents });
  });

  const controls = document.createElement("div");
  controls.className = "panel-workspace__controls";

  const runButton = createPrimaryButton("Execute Next Step", async () => {
    runButton.rootElement.disabled = true;
    runButton.rootElement.textContent = "Processing...";
    await executeTurn(services);
    runButton.rootElement.disabled = false;
    runButton.rootElement.textContent = "Execute Next Step";
  });

  controls.appendChild(runButton.rootElement);

  body.appendChild(gameStateLabel);
  body.appendChild(gameStateInput);
  body.appendChild(agentLabel);
  body.appendChild(strategyInput);
  body.appendChild(controls);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}