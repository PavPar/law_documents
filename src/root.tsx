import React from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./features/Layout";

const root = createRoot(document.body);
root.render(
  <div>
    <Layout />
  </div>
);
