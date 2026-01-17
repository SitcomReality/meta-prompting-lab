import { createHeaderBar } from "./createHeaderBar.js";
import { createMainColumns } from "./createMainColumns.js";
import { createStatusBar } from "../panels/statusBar.js";

export function createRootLayout(services) {
  const rootElement = document.createElement("div");
  rootElement.className = "app-shell";

  const header = createHeaderBar(services);
  const main = createMainColumns(services);
  const status = createStatusBar(services);

  rootElement.appendChild(header.rootElement);
  rootElement.appendChild(main.rootElement);
  rootElement.appendChild(status.rootElement);

  return {
    rootElement,
    header,
    main,
    status,
  };
}