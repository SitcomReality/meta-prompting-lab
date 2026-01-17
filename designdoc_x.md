# Game Design Document: Project Prompt-Iterate

## 1. Executive Summary
**Project Prompt-Iterate** is a technology-agnostic simulation sandbox where LLM-based agents compete in social and strategic games. The core mechanic focuses on "Recursive Prompt Engineering," allowing agents to analyze their own performance and rewrite their internal strategies, personalities, and memories in real-time to optimize for win conditions.

## 2. Core Gameplay Loop
1.  **Environment Setup:** A scenario (e.g., Mafia) is selected and bots are initialized with a Core Prompt and a Role.
2.  **Turn Execution:** 
    *   Bots receive the current game state and filtered memory.
    *   Bots generate a **Public Action** (chat/move) and a **Private Thought** (analysis).
    *   Bots optionally propose a **Prompt Change** to their "Strategy/Personality" section.
3.  **State Update:** The system processes actions, updates the game logic, and records results.
4.  **Memory Compression:** Turn logs are condensed into "Action-Result" or "Stance-Update" formats.
5.  **Iteration:** The process repeats until a win condition is met.

## 3. Agent Architecture
Each bot is defined by a modular prompt structure, split into static and dynamic components:

### 3.1 Prompt Components
*   **Fixed Core (System):** Rules of the game, output format requirements, and the "Self-Modification" directive. (Read-only for the bot).
*   **Self-Modifiable Personality/Strategy:** The bot’s current persona and tactical approach. Bots can rewrite this entire section to adapt to the game.
*   **Current Game State:** Dynamic data (Turn #, players alive, immediate dialogue).
*   **Condensed Memory:** A curated history of significant events and previous prompt iterations.

### 3.2 Memory Management (Token Optimization)
To prevent context overflow, the system utilizes three compression tiers:
1.  **The Claim Registry:** A table tracking who said what (Status: Unchallenged/Supported/Contradicted).
2.  **The Stance-Update:** A list of relationships (Subject: Stance | Confidence level).
3.  **Automated Summarization:** Every *X* turns, a secondary "Summarizer LLM" condenses the raw log into a "Long-Term Game Summary" (Max 10 bullet points).
4.  **Sliding Window:** Only the most recent raw logs are kept; older logs are deleted once summarized.

## 4. Game Modules
The system supports multiple scenarios, each with unique win conditions:
*   **Social Deduction:** Mafia/Werewolf, Murder Mystery. (Goal: Deception/Detection).
*   **Information Games:** 20 Questions, Taboo. (Goal: Efficiency/Obfuscation).
*   **Game Theory:** Prisoner’s Dilemma Tournament. (Goal: Points optimization).
*   **Collaborative Sim:** "The Island" (Survival/Governance). (Goal: Resource management/Stability).
*   **Competitive Logic:** Formal Debate. (Goal: Persuasion/Audience scoring).

## 5. User Interface (UI) Requirements
The interface is divided into three primary functional areas:

### 5.1 Dashboard & Configuration
*   **Scenario Selector:** Choose game type and adjust rules.
*   **Bot Manager:** Add/Remove bots, view/edit their raw prompts, stats, and "Claim Registries."
*   **Turn Control:** "Step" button for manual progression, or "Auto-play" toggle.

### 5.2 The Interaction Hub
*   **Public Chat Area:** The "in-game" dialogue visible to all bots and the player.
*   **Private Log/Thought Panel:** A secondary feed showing the bots' internal reasoning, "Prompt Change" proposals, and "Evaluated Outcomes" (e.g., "Strategy Change Turn 5 resulted in +20% Trust Rating").

### 5.3 Player Participation
*   An input field allowing the player to act as a "Human Bot," sending messages that are injected into the context of all AI agents.

## 6. Technical Specifications & Data Handling
*   **Persistence:** All bot data, prompt logs, and game states are saved to `LocalStorage` for session continuity.
*   **Agnostic Integration:** The system communicates via a standard JSON payload:
    *   **Input to LLM:** `{ system_prompt, history, current_state, memory_summary }`
    *   **Output from LLM:** `{ action, thoughts, revised_strategy_prompt }`
*   **Evaluation Metric:** A "Prompt Change Log" tracks the delta between versions, highlighting what was added/removed and why.

## 7. Data Formats (Examples)

### 7.1 Action-Result Format
`[Subject] performed [Action] -> [Consequence]`
*   *Example:* "Bot_A accused Bot_B of lying -> Bot_B's defensiveness increased group suspicion by 10%."

### 7.2 Stance-Update Format
`[Subject]: [Stance] ([Confidence Level]) | Reason`
*   *Example:* "Player_C: Suspicious (High) | Reason: Contradicted previous alibi regarding the Study."

### 7.3 Response Structure Requirement
Bots must respond in a structured format (JSON or Markdown Tags) to allow the system to parse the game action separately from the prompt modification instructions.