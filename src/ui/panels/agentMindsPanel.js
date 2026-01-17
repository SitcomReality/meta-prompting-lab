import { createPrimaryButton } from "../tools/primaryButton.js";
import { executeTurn } from "../../core/gameLoop.js";

export function createAgentMindsPanel(services) {
  const { store } = services;
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--primary panel--minds";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "The Agent Minds";

  const body = document.createElement("div");
  body.className = "panel__body";

  const agentTabs = document.createElement("div");
  agentTabs.className = "agent-tabs";
  agentTabs.style.display = "flex";
  agentTabs.style.gap = "var(--spacing-2)";
  agentTabs.style.marginBottom = "var(--spacing-4)";

  const configArea = document.createElement("div");
  configArea.className = "agent-config";
  configArea.style.flex = "1";
  configArea.style.display = "flex";
  configArea.style.flexDirection = "column";
  configArea.style.gap = "var(--spacing-4)";

  const strategyLabel = document.createElement("label");
  strategyLabel.className = "field-label";
  
  const strategyInput = document.createElement("textarea");
  strategyInput.className = "field-input field-input--multiline";
  strategyInput.style.flex = "1";

  strategyInput.addEventListener("input", (e) => {
    const state = store.getState();
    const updatedAgents = state.agents.map(a => 
      a.id === state.ui.selectedAgentId ? { ...a, strategyPrompt: e.target.value } : a
    );
    store.setState({ agents: updatedAgents });
  });

  const controls = document.createElement("div");
  controls.className = "panel-workspace__controls";
  
  const runButton = createPrimaryButton("Execute Full Turn", async () => {
    runButton.rootElement.disabled = true;
    runButton.rootElement.textContent = "Processing Simulation...";
    await executeTurn(services);
    runButton.rootElement.disabled = false;
    runButton.rootElement.textContent = "Execute Full Turn";
  });
  controls.appendChild(runButton.rootElement);

  function render() {
    const state = store.getState();
    const selectedAgent = state.agents.find(a => a.id === state.ui.selectedAgentId) || state.agents[0];
    
    // Render Tabs
    agentTabs.innerHTML = "";
    state.agents.forEach(agent => {
      const tab = document.createElement("button");
      tab.className = `button ${agent.id === selectedAgent.id ? 'button--primary' : 'button--secondary'}`;
      tab.style.padding = "4px 12px";
      tab.textContent = agent.name;
      tab.onclick = () => store.setState({ ui: { ...state.ui, selectedAgentId: agent.id } });
      agentTabs.appendChild(tab);
    });

    // Update strategy input
    strategyLabel.textContent = `Prompt Engineering: ${selectedAgent.name}`;
    if (document.activeElement !== strategyInput) {
      strategyInput.value = selectedAgent.strategyPrompt;
    }
  }

  store.subscribe(render);
  render();

  configArea.appendChild(strategyLabel);
  configArea.appendChild(strategyInput);
  configArea.appendChild(controls);

  body.appendChild(agentTabs);
  body.appendChild(configArea);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return { rootElement };
}