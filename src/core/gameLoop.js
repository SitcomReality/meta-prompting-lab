import { runAgentStep } from "../services/agentService.js";

export async function executeTurn(services) {
  const { store, bus } = services;
  const state = store.getState();

  if (state.session.isRunning) return;

  store.setState({ 
    session: { ...state.session, isRunning: true },
    ui: { ...state.ui, statusMessage: "Agents are thinking..." }
  });

  const activeAgent = state.agents[0]; // For v0, we process the first agent
  const context = {
    gameState: state.gameState || "The game has just begun.",
    globalRules: state.metaPrompt.rules,
  };

  const result = await runAgentStep(activeAgent, context);

  // Update State
  const newHistoryItem = {
    step: state.session.stepIndex + 1,
    agentId: activeAgent.id,
    agentName: activeAgent.name,
    thought: result.thought,
    action: result.publicAction,
    strategyUpdate: result.proposedStrategyUpdate,
    rationale: result.updateRationale,
    timestamp: Date.now(),
  };

  const updatedAgents = state.agents.map(a => {
    if (a.id === activeAgent.id) {
      return {
        ...a,
        strategyPrompt: result.proposedStrategyUpdate || a.strategyPrompt,
        history: [...a.history, { role: "assistant", content: result.publicAction }]
      };
    }
    return a;
  });

  store.setState({
    session: {
      ...state.session,
      stepIndex: state.session.stepIndex + 1,
      isRunning: false,
    },
    agents: updatedAgents,
    history: [newHistoryItem, ...state.history],
    ui: { ...state.ui, statusMessage: "Turn complete." }
  });

  bus.emit("TURN_COMPLETED", newHistoryItem);
}