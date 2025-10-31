import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./components/ui/explain-answer-button.css";

createRoot(document.getElementById("root")!).render(<HashRouter><App /></HashRouter>);
