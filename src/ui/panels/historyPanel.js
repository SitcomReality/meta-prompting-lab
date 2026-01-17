export function createHistoryPanel(services) {
  const { store } = services;
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--tertiary panel--history";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Session History";

  const body = document.createElement("div");
  body.className = "panel__body panel-history";
  body.style.overflowY = "auto";

  function renderHistory(history) {
    body.innerHTML = "";
    if (history.length === 0) {
      const placeholder = document.createElement("div");
      placeholder.className = "panel-history__placeholder";
      placeholder.textContent = "No turns executed yet.";
      body.appendChild(placeholder);
      return;
    }

    history.forEach((item) => {
      const card = document.createElement("div");
      card.className = "history-card";
      
      const meta = document.createElement("div");
      meta.className = "history-card__meta";
      meta.textContent = `Turn ${item.step} — ${item.agentName}`;

      const action = document.createElement("div");
      action.className = "history-card__action";
      action.textContent = item.action;

      const thought = document.createElement("div");
      thought.className = "history-card__thought";
      thought.textContent = `Thought: ${item.thought}`;

      if (item.strategyUpdate) {
        const update = document.createElement("div");
        update.className = "history-card__update-badge";
        update.textContent = "Strategy Updated";
        update.title = item.rationale;
        card.appendChild(update);
      }

      card.appendChild(meta);
      card.appendChild(action);
      card.appendChild(thought);
      body.appendChild(card);
    });
  }

  store.subscribe((state) => renderHistory(state.history));
  renderHistory(store.getState().history);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}