export function createMetaRulesPanel() {
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--secondary panel--rules";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Meta Rules";

  const body = document.createElement("div");
  body.className = "panel__body panel-rules";

  const placeholder = document.createElement("div");
  placeholder.className = "panel-rules__placeholder";
  placeholder.textContent = "Rule cards, constraints, and scoring hooks will appear here.";

  body.appendChild(placeholder);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}