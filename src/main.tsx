import App from "@/App.tsx";
import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <App />
                <Toaster />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
