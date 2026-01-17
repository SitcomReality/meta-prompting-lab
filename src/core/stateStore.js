import { SCENARIOS } from "./scenarios.js";

export function createInitialState() {
  const defaultScenario = SCENARIOS.debate;
  
  return {
    session: {
      id: "session_" + Date.now(),
      stepIndex: 0,
      isRunning: false,
      currentScenarioId: defaultScenario.id,
    },
    gameState: defaultScenario.initialGameState,
    metaPrompt: {
      rules: [...defaultScenario.initialRules],
    },
    agents: defaultScenario.defaultAgents.map(a => ({
      ...a,
      history: [],
      // Condensed memory items (object shape for stability)
      memory: { events: [], stances: [], claims: [] },
      // Track self-modifications over time
      promptChangeLog: [],
      isActive: true
    })),
    history: [],
    ui: {
      selectedAgentId: defaultScenario.defaultAgents[0].id,
      statusMessage: "Scenario initialized: " + defaultScenario.name
    },
  };
}

export function createStateStore(initialState = createInitialState()) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partial) {
    // Shallow merge at root; callers should pass fully updated nested branches.
    state = { ...state, ...partial };
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    getState,
    setState,
    subscribe,
  };
}