export function createStatusBar(services) {
  const rootElement = document.createElement("footer");
  rootElement.className = "app-shell__status status-bar";

  const stepLabel = document.createElement("div");
  stepLabel.className = "status-bar__item status-bar__item--step";
  stepLabel.textContent = "Step: 0";

  const modeLabel = document.createElement("div");
  modeLabel.className = "status-bar__item status-bar__item--mode";
  modeLabel.textContent = "Mode: Sandbox";

  const hintLabel = document.createElement("div");
  hintLabel.className = "status-bar__item status-bar__item--hint";
  hintLabel.textContent = "Ready to experiment with meta prompts.";

  rootElement.appendChild(stepLabel);
  rootElement.appendChild(modeLabel);
  rootElement.appendChild(hintLabel);

  const { store } = services;
  store.subscribe((state) => {
    stepLabel.textContent = `Step: ${state.session.stepIndex}`;
    hintLabel.textContent = state.ui.statusMessage || "Ready.";
  });

  return {
    rootElement,
  };
}