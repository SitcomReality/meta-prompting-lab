import { SCENARIOS } from "../../core/scenarios.js";
import { createInitialState } from "../../core/stateStore.js";

export function createControlPanel(services) {
  const { store } = services;
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--secondary panel--control";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Scenario & Constraints";

  const body = document.createElement("div");
  body.className = "panel__body";

  // Scenario Selector
  const scenarioLabel = document.createElement("label");
  scenarioLabel.className = "field-label";
  scenarioLabel.textContent = "Active Scenario";
  
  const scenarioSelect = document.createElement("select");
  scenarioSelect.className = "field-input";
  Object.values(SCENARIOS).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    scenarioSelect.appendChild(opt);
  });

  scenarioSelect.addEventListener("change", (e) => {
    const scenario = SCENARIOS[e.target.value];
    if (confirm(`Switching to ${scenario.name} will reset the current session. Continue?`)) {
      const newState = createInitialState();
      // Overwrite with scenario specific data
      newState.session.currentScenarioId = scenario.id;
      newState.gameState = scenario.initialGameState;
      newState.metaPrompt.rules = [...scenario.initialRules];
      newState.agents = scenario.defaultAgents.map(a => ({...a, history: [], memory: [], isActive: true}));
      newState.ui.selectedAgentId = scenario.defaultAgents[0].id;
      store.setState(newState);
    } else {
      scenarioSelect.value = store.getState().session.currentScenarioId;
    }
  });

  // Global Rules List
  const rulesListLabel = document.createElement("label");
  rulesListLabel.className = "field-label";
  rulesListLabel.textContent = "Global Meta-Rules";
  
  const rulesContainer = document.createElement("div");
  rulesContainer.className = "rules-container";
  rulesContainer.style.display = "flex";
  rulesContainer.style.flexDirection = "column";
  rulesContainer.style.gap = "var(--spacing-2)";

  function renderRules(rules) {
    rulesContainer.innerHTML = "";
    rules.forEach((rule, idx) => {
      const ruleEl = document.createElement("div");
      ruleEl.className = "rule-item";
      ruleEl.textContent = rule;
      rulesContainer.appendChild(ruleEl);
    });
  }

  // Player Interaction
  const interactionLabel = document.createElement("label");
  interactionLabel.className = "field-label";
  interactionLabel.textContent = "Inject Event / Player Message";

  const interactionInput = document.createElement("div");
  interactionInput.style.display = "flex";
  interactionInput.style.gap = "var(--spacing-2)";

  const interactionField = document.createElement("input");
  interactionField.className = "field-input";
  interactionField.placeholder = "Type something as 'The Player'...";

  const sendButton = document.createElement("button");
  sendButton.className = "button button--primary";
  sendButton.textContent = "Inject";
  sendButton.onclick = () => {
    const val = interactionField.value.trim();
    if (!val) return;
    const currentState = store.getState();
    const newGameState = currentState.gameState + `\nPlayer: ${val}`;
    
    // Also inject into agents' histories so they remember the player's message
    const updatedAgents = currentState.agents.map(a => ({
      ...a,
      history: [...a.history, { role: "user", content: `Player: ${val}` }]
    }));

    store.setState({ 
      gameState: newGameState, 
      agents: updatedAgents,
      ui: { ...currentState.ui, statusMessage: "Message injected into simulation context." }
    });
    interactionField.value = "";
  };

  interactionInput.appendChild(interactionField);
  interactionInput.appendChild(sendButton);

  // Game State Textarea
  const stateLabel = document.createElement("label");
  stateLabel.className = "field-label";
  stateLabel.textContent = "World State (Raw Context)";
  
  const stateInput = document.createElement("textarea");
  stateInput.className = "field-input field-input--multiline";
  stateInput.style.fontSize = "var(--font-size-xs)";
  stateInput.style.height = "150px";

  stateInput.addEventListener("input", (e) => {
    store.setState({ gameState: e.target.value });
  });

  store.subscribe((state) => {
    scenarioSelect.value = state.session.currentScenarioId;
    renderRules(state.metaPrompt.rules);
    if (document.activeElement !== stateInput) {
      stateInput.value = state.gameState;
    }
  });

  const state = store.getState();
  renderRules(state.metaPrompt.rules);
  stateInput.value = state.gameState;

  body.appendChild(scenarioLabel);
  body.appendChild(scenarioSelect);
  body.appendChild(rulesListLabel);
  body.appendChild(rulesContainer);
  body.appendChild(interactionLabel);
  body.appendChild(interactionInput);
  body.appendChild(stateLabel);
  body.appendChild(stateInput);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return { rootElement };
}