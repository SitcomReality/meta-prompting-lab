export function createPrimaryButton(label, onClick) {
  const rootElement = document.createElement("button");
  rootElement.className = "button button--primary";
  rootElement.type = "button";
  rootElement.textContent = label;
  rootElement.addEventListener("click", onClick);

  return {
    rootElement,
  };
}