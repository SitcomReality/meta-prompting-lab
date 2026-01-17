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
      memory: [], // Condensed memory items
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
    // Deep merging or simple shallow? Let's stick to shallow for root properties but handle nested carefully if needed.
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