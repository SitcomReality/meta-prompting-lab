export function createInitialState() {
  return {
    session: {
      id: null,
      stepIndex: 0,
      isRunning: false,
    },
    metaPrompt: {
      systemPrompt: "",
      userPrompt: "",
      rules: [],
    },
    history: [],
    ui: {
      activePanel: "workspace", // "workspace" | "rules" | "history"
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