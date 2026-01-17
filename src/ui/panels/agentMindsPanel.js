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
  configArea.style.minHeight = "0";

  // Sub-tabs for Strategy vs Memory
  const subTabs = document.createElement("div");
  subTabs.style.display = "flex";
  subTabs.style.gap = "var(--spacing-4)";
  subTabs.style.borderBottom = "1px solid var(--color-border-subtle)";
  subTabs.style.paddingBottom = "var(--spacing-2)";

  let activeSubTab = "strategy"; // "strategy" or "memory"

  const createSubTab = (id, label) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = "button button--secondary";
    btn.style.background = "transparent";
    btn.style.border = "none";
    btn.style.fontWeight = "bold";
    btn.onclick = () => {
      activeSubTab = id;
      render();
    };
    return btn;
  };

  const strategyTabBtn = createSubTab("strategy", "Self-Modifiable Strategy");
  const memoryTabBtn = createSubTab("memory", "Condensed Memory");
  subTabs.appendChild(strategyTabBtn);
  subTabs.appendChild(memoryTabBtn);

  const contentContainer = document.createElement("div");
  contentContainer.style.flex = "1";
  contentContainer.style.display = "flex";
  contentContainer.style.flexDirection = "column";
  contentContainer.style.overflowY = "auto";

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
    const agents = Array.isArray(state.agents) ? state.agents : [];
    const selectedAgent = agents.find(a => a.id === state.ui.selectedAgentId) || agents[0] || null;
    
    // Render Tabs
    agentTabs.innerHTML = "";
    if (agents.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "field-label";
      emptyMsg.textContent = "No agents available in this scenario.";
      agentTabs.appendChild(emptyMsg);
    } else {
      agents.forEach(agent => {
        const tab = document.createElement("button");
        const isSelected = selectedAgent && agent.id === selectedAgent.id;
        tab.className = `button ${isSelected ? 'button--primary' : 'button--secondary'}`;
        tab.style.padding = "4px 12px";
        tab.textContent = agent.name;
        tab.onclick = () => store.setState({ ui: { ...state.ui, selectedAgentId: agent.id } });
        agentTabs.appendChild(tab);
      });
    }

    // Sub-tab styling
    strategyTabBtn.style.color = activeSubTab === "strategy" ? "var(--color-accent)" : "var(--color-text-muted)";
    memoryTabBtn.style.color = activeSubTab === "memory" ? "var(--color-accent)" : "var(--color-text-muted)";

    contentContainer.innerHTML = "";
    if (!selectedAgent) {
      const placeholder = document.createElement("div");
      placeholder.className = "field-label";
      placeholder.textContent = "Select or add an agent to view its configuration.";
      contentContainer.appendChild(placeholder);
      return;
    }

    if (activeSubTab === "strategy") {
      contentContainer.appendChild(strategyInput);
      if (document.activeElement !== strategyInput) {
        strategyInput.value = selectedAgent.strategyPrompt || "";
      }
    } else {
      const memoryView = document.createElement("div");
      memoryView.className = "memory-viewer";
      memoryView.style.fontSize = "var(--font-size-sm)";
      memoryView.style.whiteSpace = "pre-wrap";
      memoryView.style.padding = "var(--spacing-4)";
      memoryView.style.background = "var(--color-surface-elevated)";
      memoryView.style.borderRadius = "var(--radius-sm)";
      
      const mem = selectedAgent.memory || { events: [], stances: [], claims: [] };
      let text = "";
      if (Array.isArray(mem.events) && mem.events.length) text += `## EVENTS\n${mem.events.map(e => `- ${e}`).join("\n")}\n\n`;
      if (Array.isArray(mem.stances) && mem.stances.length) text += `## STANCES\n${mem.stances.map(s => `- ${s.subject}: ${s.stance} | ${s.reason}`).join("\n")}\n\n`;
      if (Array.isArray(mem.claims) && mem.claims.length) text += `## CLAIMS\n${mem.claims.map(c => `- ${c.claim} (${c.status})`).join("\n")}`;
      
      memoryView.textContent = text || "No memory entries yet. Execute a turn to populate.";
      contentContainer.appendChild(memoryView);
    }
  }

  store.subscribe(render);
  render();

  configArea.appendChild(subTabs);
  configArea.appendChild(contentContainer);
  configArea.appendChild(controls);

  body.appendChild(agentTabs);
  body.appendChild(configArea);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return { rootElement };
}