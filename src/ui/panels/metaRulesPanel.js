export function createMetaRulesPanel(services) {
  const { store } = services;
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--secondary panel--rules";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Constraints & Rules";

  const body = document.createElement("div");
  body.className = "panel__body panel-rules";

  function renderRules(rules) {
    body.innerHTML = "";
    rules.forEach((rule) => {
      const ruleEl = document.createElement("div");
      ruleEl.className = "rule-item";
      ruleEl.textContent = rule;
      body.appendChild(ruleEl);
    });
  }

  store.subscribe((state) => renderRules(state.metaPrompt.rules));
  renderRules(store.getState().metaPrompt.rules);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}