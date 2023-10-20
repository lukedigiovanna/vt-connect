import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { UserAccountProvider } from "./components/providers/UserAccountProvider";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <UserAccountProvider>
        <Router>
            <App />
        </Router>
    </UserAccountProvider>
);
