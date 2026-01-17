import { runAgentStep } from "../services/agentService.js";
import { extractMemoryUpdates } from "../services/memoryService.js";

export async function executeTurn(services) {
  const { store, bus } = services;
  const state = store.getState();

  if (state.session.isRunning) return;

  store.setState({ 
    session: { ...state.session, isRunning: true },
    ui: { ...state.ui, statusMessage: "All agents are deliberating..." }
  });

  const updatedHistory = [...state.history];
  let currentGameState = state.gameState;
  const updatedAgents = [...state.agents];

  // Process each active agent sequentially in the turn
  for (let i = 0; i < updatedAgents.length; i++) {
    const agent = updatedAgents[i];
    if (!agent.isActive) continue;

    const context = {
      gameState: currentGameState,
      globalRules: state.metaPrompt.rules,
    };

    try {
      const result = await runAgentStep(agent, context);

      const turnResult = {
        step: state.session.stepIndex + 1,
        agentId: agent.id,
        agentName: agent.name,
        thought: result.thought,
        action: result.publicAction,
        strategyUpdate: result.proposedStrategyUpdate,
        rationale: result.updateRationale,
        timestamp: Date.now(),
      };

      updatedHistory.unshift(turnResult);
      
      // 1. Process Memory Updates
      const memoryUpdates = await extractMemoryUpdates(agent, result.publicAction, context);
      
      let newMemory = agent.memory || { events: [], stances: [], claims: [] };
      if (memoryUpdates) {
        newMemory = {
          events: [...(newMemory.events || []), ...(memoryUpdates.newEvents || [])].slice(-10),
          stances: memoryUpdates.stances || newMemory.stances, // Overwrite stances with latest appraisal
          claims: [...(newMemory.claims || []), ...(memoryUpdates.claims || [])].slice(-15)
        };
      }

      // 2. Update the specific agent in our local array
      updatedAgents[i] = {
        ...agent,
        strategyPrompt: result.proposedStrategyUpdate || agent.strategyPrompt,
        history: [...agent.history, { role: "assistant", content: result.publicAction }],
        memory: newMemory
      };

      // 3. Update current game state with the new action so next agent sees it immediately
      currentGameState += `\n${agent.name}: ${result.publicAction}`;

    } catch (err) {
      console.error(`Error processing agent ${agent.name}:`, err);
    }
  }

  store.setState({
    session: {
      ...state.session,
      stepIndex: state.session.stepIndex + 1,
      isRunning: false,
    },
    gameState: currentGameState,
    agents: updatedAgents,
    history: updatedHistory,
    ui: { ...state.ui, statusMessage: `Turn ${state.session.stepIndex + 1} completed.` }
  });

  bus.emit("TURN_COMPLETED", { step: state.session.stepIndex + 1 });
}