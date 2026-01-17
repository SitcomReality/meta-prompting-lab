export function createInitialState() {
  return {
    session: {
      id: "session_" + Date.now(),
      stepIndex: 0,
      isRunning: false,
    },
    gameState: "A high-stakes debate about the future of AI governance. You are the lead skeptic.",
    metaPrompt: {
      rules: [
        "Recursive adaptation: You MUST update your strategy if your current one fails.",
        "Consistency: Maintain your core identity despite strategy shifts.",
        "Conciseness: Keep public actions under 50 words."
      ],
    },
    agents: [
      {
        id: "bot_1",
        name: "Socrates-GPT",
        corePrompt: "You are a strategic debater. Your goal is to win the argument by questioning assumptions.",
        strategyPrompt: "Initial Strategy: Be polite but firm. Use the Socratic method to lead opponents into contradictions.",
        history: []
      }
    ],
    history: [],
    ui: {
      activePanel: "workspace",
      statusMessage: "Ready to begin."
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