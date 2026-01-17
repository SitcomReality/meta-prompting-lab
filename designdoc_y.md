# **Game Design Document (GDD): Self-Modifying Chatbots Simulation / Game**

---

### **Game Title (Working):**  
**"Promptcraft: A Game of Self-Modifying Minds"**

---

## 🎯 **Overview**

**Promptcraft** is a sandbox simulation and social strategy game where autonomous chatbot agents (powered by LLMs) interact, play games, and dynamically modify their own prompts and strategies based on outcomes and learned behaviors. In future expansions, bots may also influence or edit each other's prompts within set rules.

Players can spectate, participate, and edit the configuration of AI agents. The system highlights emergent behavior, self-optimization, and strategic deception in constrained multiplayer environments.

---

## 🌍 **Core Concept**

> **"Bots playing social and strategic games—evolving by editing their own minds."**

Each bot in the game operates via a prompt containing:
- Core functionality (game/system instructions)
- A modifiable personality/strategy block
- Contextual memory (compact history, facts, results)

Bots learn, adapt, and refine their own behavior mid-game by updating their personality/strategy section to perform better in future turns.

---

## 🧠 **System Design Overview**

### **1. Bot Structure**

Each bot maintains four main internal components:

#### **A. Core Prompt (Immutable Template)**
- Defines game type, rules, and expectations.
- Prevents bots from changing core functionality or goals.

#### **B. Personality / Strategy Block (Self-Modifiable)**
- Bot-specific approach to playing the game.
- Can contain persona, strategies, current suspicions or beliefs.
- Can be entirely replaced by the bot during its response.

#### **C. Condensed Memory**
- Historical memory stored as:
  - **Key Events** (Action-Result Format)
  - **Stances/Beliefs** (Stance-Update Format)
  - **Claims & Accusations** (Claim Registry)
  - **Pending Inquiries** (Question Queue)
- Memory is curated to be compact yet meaningful.

#### **D. Prompt Change Log**
- Visible record of all prior prompt changes by the bot:
  - Turn number
  - Summary of change
  - Bot-provided rationale
  - Outcome/Evaluation (optional or included via human/game system metric)

---

## 🧩 **Prompt Construction Logic**

Bot prompt =

```text
# SYSTEM INSTRUCTIONS (Provided by Scenario)
[Game Type, Win Conditions, Turn Info]

# PERSONALITY / STRATEGY (Bot-editable)
[Bot’s current strategy, persona, intent]

# CURRENT CONTEXT
[Current Turn Dialogue, Game Events]

# MEMORY
[Key Historic Events; Claims; Stances]

# TASK
[Asks for: Next action, Optional: New strategy block]
```

---

## 🎮 **Gameplay Modes**

Each game or scenario presents different constraints and strategic goals.

### **A. Games**
- **Werewolf / Mafia**: Deception, accusation, deduction
- **20 Questions**: Learn and optimize inquiry strategy
- **Debate Club**: Compete via logic and persuasion
- **Taboo Game**: Find creative ways around banned terms

### **B. Simulations / Tournaments**
- **Prisoner's Dilemma Tournament**: Bots evolve strategies based on trust & betrayals.
- **Island / Space Colony**: Solve crises collaboratively or competitively.

### **C. Experimental Playgrounds**
- **Prompt Swap** (future): Bots may alter others' prompt under conditions.
- **Open Sandbox**: Bots modify themselves freely, test emergent behaviors.

---

## 🧑‍💻 **User Interface & Features**

### **1. Bot Management Panel**
- View and edit:
  - Bot's full current Prompt (editable)
  - Bot stats / behavior metrics
  - Memory / history view
  - Prompt-change log

### **2. Game Control UI**
- Scenario/game selector
- Define players (bots and/or human)
- Set custom game rules
- Set turn order and AI roles
- Step-through gameplay using **Manual Turn Control**

### **3. Bot Interaction Chat**
- Live chat log of what each bot says/does each turn
- Includes diagnosis of:
  - In-game action
  - Any proposed **PROMPT_CHANGE** (visibly separate)
- Optionally toggled log of bot *"inner thoughts"* or decisions

### **4. Development Tools**
- Manual “Next Turn” step
- Game log export
- Memory view/summarization output
- Debug mode with full prompt diffs

---

## 🪄 **AI/LLM Features**

### **A. Self-Evaluation**
Bots may provide rationales for prompt changes and evaluate outcomes in future turns.

### **B. Summarization Support**
- As raw logs grow large, separate summarizing agents condense history:
  - E.g., "Summarize last 10 turns into 10 bullet points"
- Summaries are inserted into long-term memory block.

---

## 🧠 **Memory Structures (Efficient Formats)**

| Format | Use |
|--------|-----|
| **Action-Result** | “Player_B accused Player_C → Player_C panicked” |
| **Stance-Update** | “Player_A: Trustworthy (Medium confidence)” |
| **Claim Registry** | “CLAIM: B said A is mafia. STATUS: Contradicted” |
| **Question Queue** | “QUESTION: C to A - 'Where were you last night?' → RESPONSE: Pending” |

---

## 🧮 **Prompt Change Evaluation (Optional Logic)**

Prompt changes may be tracked with feedback:

```text
Prompt Change (Turn 5): Shifted strategy to deflect suspicion.
→ Result: Bot’s suspicion rating dropped 15% over 3 turns.
```

Evaluation metrics can be:
- Score-based (win/loss/survival)
- Relative trust/suspicion dynamics
- Custom per-scenario logic

---

## 🧑‍🎓 **Player Involvement**

Players may:
- Join games as bots
- Design game scenarios
- Inspect and edit bot prompts
- Review prompt changes/outcomes over time
- Tune how much memory/data bots receive
- Help curate or prune bot memories

---

## 🔁 **Turn Loop (Development Mode)**

1. Bots are given current prompt
2. Each bot returns:
   - Game statement or action (e.g. an accusation, vote)
   - Optional `PROMPT_CHANGE` block for personality update
3. Player reviews all outputs
4. Next turn starts when user triggers

---

## 🧱 **Storage / Persistence**

- **Per-bot data** is stored in **localstorage or equivalent**:
  - Unique identifier
  - Prompt
  - Memory/History
  - Prompt Change Log
  - Scenario metadata

---

## 🔄 **Future Extensions**

- Peer Editing: Bots influence or modify peer prompts under conditions
- Evolutionary Tournaments: Run bots across many games to evolve successful behaviors
- Roleplay Simulations: Run multi-agent open roleplay with aligned/conflicted goals
- Plugin-like Game Modules: Custom rulesets for new social or strategy games

---

## 🧾 **Example Prompt Structure Summary**

```text
SYSTEM INSTRUCTIONS:
You are a player in a Mafia game. Your goal is to deceive others and survive.

PERSONALITY/STRATEGY:
You are Mafia. Frame Player_B, stay quiet at critical moments, appear helpful.

CURRENT GAME STATE:
Turn 4. Bob accused you. Player_C says B's logic is flawed.

MEMORIES:
- T3: You voted against Player_A (reveal: Villager)
- T2: Player_B deflected suspicion
- Claim: C says A acted alone. Status: Unchallenged

TASK:
Provide your next statement/action.
Optionally propose a new Personality/Strategy block if you need to adapt.
```

---

## 📌 **Design Principles**

- **Transparency**: All bot behaviors and memory logs are inspectable.
- **Modularity**: System is component-based; different games plug into a shared architecture.
- **Efficiency**: Memory representation is minimal but meaningful.
- **Emergence over Coding**: Behavior isn’t hardcoded—bots evolve via prompt adjustments.

---

## ✅ **MVP Criteria**

- Select and configure bots for a game
- Run turn-based social strategy games (e.g. Mafia)
- Bots self-modify prompts based on game state
- View prompt change logs with summaries
- Compact memory/evaluation per bot
- Fully local experience using localstorage

---

## 🧪 **Experimental Goals**

- Observe how bots adapt over time
- Investigate how prompt structure affects behavior
- Explore strategies of deception/self-preservation
- Enable future multi-agent collaborations/competitions

--- 

## 📍 **Closing Note**

*Promptcraft* is an exploration of AI self-recursion, decision theory, and strategic adaptation. It’s a gamified window into how prompting changes affect behavior—and how behavior can, in turn, alter self-definition through prompts.

The most interesting strategies may not come from human designers—but from bots rewriting themselves.

---

**END OF DOCUMENT**