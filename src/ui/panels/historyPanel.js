export function createHistoryPanel() {
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--tertiary panel--history";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Session History";

  const body = document.createElement("div");
  body.className = "panel__body panel-history";

  const placeholder = document.createElement("div");
  placeholder.className = "panel-history__placeholder";
  placeholder.textContent = "LLM turns and meta moves will be tracked here.";

  body.appendChild(placeholder);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}