import { formatMemoryForPrompt } from "./memoryService.js";

export async function runAgentStep(agent, context) {
  const { corePrompt, strategyPrompt, history, memory } = agent;
  const { gameState, globalRules } = context;

  const systemMessage = `
# CORE INSTRUCTIONS
${corePrompt}

# GLOBAL RULES
${globalRules.join("\n")}

# CURRENT STRATEGY & PERSONALITY
${strategyPrompt}

# MEMORY & KNOWLEDGE
${formatMemoryForPrompt(memory)}

# RESPONSE FORMAT
You must respond in valid JSON format ONLY. 
{
  "thought": "Your internal reasoning about the current state and your strategy",
  "publicAction": "What you say or do in the game",
  "proposedStrategyUpdate": "Optional: A rewritten version of your STRATEGY & PERSONALITY block to better achieve your goals",
  "updateRationale": "Why you are changing your strategy"
}
`;

  const userMessage = `
# CURRENT WORLD STATE
${gameState}

# RECENT DIALOGUE (Last 5)
${history.slice(-5).map(h => `${h.role}: ${h.content}`).join("\n")}

Respond now.
`;

  try {
    const completion = await websim.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      json: true,
    });

    return JSON.parse(completion.content);
  } catch (error) {
    console.error("Agent execution failed:", error);
    return {
      thought: "I encountered an error in my processing.",
      publicAction: "...",
      proposedStrategyUpdate: null,
      updateRationale: "Error recovery"
    };
  }
}