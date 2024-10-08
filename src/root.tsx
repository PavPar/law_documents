import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./features/App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { HashRouter } from "react-router-dom";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

const domNode = document.getElementById("root") as Element;
const root = createRoot(domNode);

root.render(
  <Provider store={store}>
    <PrimeReactProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </PrimeReactProvider>
  </Provider>
);
