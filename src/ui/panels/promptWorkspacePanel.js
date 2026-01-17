import { createPrimaryButton } from "../tools/primaryButton.js";

export function createPromptWorkspacePanel(services) {
  const rootElement = document.createElement("section");
  rootElement.className = "panel panel--primary panel--workspace";

  const header = document.createElement("header");
  header.className = "panel__header";
  header.textContent = "Prompt Workspace";

  const body = document.createElement("div");
  body.className = "panel__body panel-workspace";

  const systemLabel = document.createElement("label");
  systemLabel.className = "field-label";
  systemLabel.textContent = "System meta-prompt";

  const systemInput = document.createElement("textarea");
  systemInput.className = "field-input field-input--multiline";
  systemInput.placeholder = "Define the rules that shape the AI's behavior...";

  const userLabel = document.createElement("label");
  userLabel.className = "field-label";
  userLabel.textContent = "User prompt";

  const userInput = document.createElement("textarea");
  userInput.className = "field-input field-input--multiline";
  userInput.placeholder = "Write the concrete task prompt here...";

  const controls = document.createElement("div");
  controls.className = "panel-workspace__controls";

  const runButton = createPrimaryButton("Run Step", () => {
    // Placeholder for future game loop / LLM call
    const { store } = services;
    const prev = store.getState();
    store.setState({
      metaPrompt: {
        ...prev.metaPrompt,
        systemPrompt: systemInput.value,
        userPrompt: userInput.value,
      },
    });
  });

  controls.appendChild(runButton.rootElement);

  body.appendChild(systemLabel);
  body.appendChild(systemInput);
  body.appendChild(userLabel);
  body.appendChild(userInput);
  body.appendChild(controls);

  rootElement.appendChild(header);
  rootElement.appendChild(body);

  return {
    rootElement,
  };
}