/**
 * Service to handle memory condensation and extraction of stances/claims.
 * Uses an LLM to process raw history into structured memory formats.
 */

export async function extractMemoryUpdates(agent, lastAction, context) {
  const systemPrompt = `
You are a Memory Processing Unit for an AI agent in a social simulation.
Your task is to analyze the latest game event and update the agent's internal memory.
Focus on:
1. ACTION-RESULT: What happened and what was the immediate effect.
2. STANCE-UPDATE: How does the agent feel about others now? (Trust/Suspicion)
3. CLAIM REGISTRY: What specific claims were made? (True/False/Unverified)

Agent Profile: ${agent.name}
Current Strategy: ${agent.strategyPrompt}

Respond in valid JSON:
{
  "newEvents": ["Short bullet point of what happened"],
  "stances": [{ "subject": "Name", "stance": "Suspicious/Friendly/Neutral", "confidence": 0.0-1.0, "reason": "..." }],
  "claims": [{ "claim": "...", "source": "Name", "status": "Unchallenged/Supported/Contradicted" }]
}
`;

  const userPrompt = `
LAST ACTION BY ${agent.name}: ${lastAction}
CURRENT WORLD STATE: ${context.gameState}
`;

  try {
    const completion = await websim.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      json: true,
    });

    return JSON.parse(completion.content);
  } catch (err) {
    console.error("Memory extraction failed", err);
    return null;
  }
}

export function formatMemoryForPrompt(memory) {
  if (!memory || memory.length === 0) return "No significant memories yet.";
  
  // memory is expected to be an object with { events, stances, claims }
  const lines = [];
  
  if (memory.events?.length) {
    lines.push("## RECENT EVENTS");
    memory.events.forEach(e => lines.push(`- ${e}`));
  }
  
  if (memory.stances?.length) {
    lines.push("\n## SOCIAL STANCES");
    memory.stances.forEach(s => lines.push(`- ${s.subject}: ${s.stance} (Conf: ${s.confidence}) | ${s.reason}`));
  }
  
  if (memory.claims?.length) {
    lines.push("\n## CLAIM REGISTRY");
    memory.claims.forEach(c => lines.push(`- "${c.claim}" (Source: ${c.source}) | Status: ${c.status}`));
  }
  
  return lines.join("\n");
}