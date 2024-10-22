import "~/styles/globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { createRouter } from "./router";
import { ThemeProvider } from "./components/theme-provider";

const router = createRouter();

const rootElement = document.getElementById("__nexcom")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>,
  );
}
