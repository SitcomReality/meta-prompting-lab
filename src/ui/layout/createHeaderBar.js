export function createHeaderBar() {
  const rootElement = document.createElement("header");
  rootElement.className = "app-shell__header header-bar";

  const title = document.createElement("div");
  title.className = "header-bar__title";
  title.textContent = "LLM Meta Prompting Lab";

  const mode = document.createElement("div");
  mode.className = "header-bar__mode-label";
  mode.textContent = "Prototype · v0";

  rootElement.appendChild(title);
  rootElement.appendChild(mode);

  return { rootElement };
}