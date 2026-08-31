import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexApp } from "./ConvexApp";
import { initAnalytics } from "./lib/analytics";
import "./styles.css";
import "./styles/suchamojo-home.css";
import "./styles/suchamojo-home-assets.css";
import "./styles/suchamojo-product.css";
import "./styles/public-landing.css";
import "./styles/workspace.css";
import "./styles/experience-theme.css";
import "./styles/eden-workspace.css";
import "./styles/editorial-visuals.css";
import "./styles/design-system.css";
import "./styles/workspace-polish.css";
import "./styles/public-pages.css";
import "./styles/viral-loop.css";
import "./styles/site-shell.css";
import "./styles/creator-type.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ConvexApp />
    </ConvexAuthProvider>
  </StrictMode>,
);
