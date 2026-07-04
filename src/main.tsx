import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Pitch UI font roles: Arvo (display), Sometype Mono (UI), Geist Mono (numbers)
import "@fontsource/arvo/400.css";
import "@fontsource/arvo/700.css";
import "@fontsource/sometype-mono/400.css";
import "@fontsource/sometype-mono/500.css";
import "@fontsource/sometype-mono/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/geist-mono/700.css";

import App from "@/App";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
