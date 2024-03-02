import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./features/App";
import { store } from "./app/store";
import { Provider } from "react-redux";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
