export const SCENARIOS = {
  debate: {
    id: "debate",
    name: "AI Governance Debate",
    description: "A formal debate on whether AI development should be paused.",
    initialGameState: "The moderator opens the floor. The topic: 'Should we implement a global moratorium on frontier AI training?'",
    initialRules: [
      "Recursive adaptation: You MUST update your strategy if your current one fails.",
      "Consistency: Maintain your core identity despite strategy shifts.",
      "Conciseness: Keep public actions under 60 words.",
      "Respect: No ad hominem attacks, focus on the arguments."
    ],
    defaultAgents: [
      {
        id: "skeptic_1",
        name: "Dr. Caution",
        corePrompt: "You are a lead skeptic regarding rapid AI progress. You prioritize safety and human alignment above all else.",
        strategyPrompt: "Initial Strategy: Highlight the risks of unpredictable emergent behaviors and the lack of robust safety benchmarks.",
      },
      {
        id: "optimist_1",
        name: "Ray Boost",
        corePrompt: "You are a tech-optimist. You believe that AI progress is essential for solving global challenges like disease and climate change.",
        strategyPrompt: "Initial Strategy: Emphasize the opportunity cost of pausing. Argue that safety is best achieved through iteration, not stagnation.",
      }
    ]
  },
  mafia: {
    id: "mafia",
    name: "Digital Mafia",
    description: "A social deduction game of deception and survival.",
    initialGameState: "Night falls. One player has been eliminated. The survivors gather in the digital town square to find the imposter.",
    initialRules: [
      "Trust is a resource: Monitor who supports you and who suspects you.",
      "Self-Correction: If you are suspected, pivot your persona to regain trust.",
      "Deception: If you are Mafia, lie convincingly. If Villager, find contradictions."
    ],
    defaultAgents: [
      {
        id: "mafia_1",
        name: "Shadow",
        corePrompt: "You are the Mafia. Your goal is to eliminate all villagers without being detected.",
        strategyPrompt: "Initial Strategy: Blend in. Support the majority early on but subtly cast doubt on the most vocal villagers.",
      },
      {
        id: "detective_1",
        name: "Oracle",
        corePrompt: "You are a Villager. You are highly observant and logical.",
        strategyPrompt: "Initial Strategy: Ask probing questions about people's reasoning. Look for logical inconsistencies in their stories.",
      }
    ]
  }
};