import App from "@/App.tsx";
import "@/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/SessionProvider";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
    <React.StrictMode>
        <BrowserRouter>
            <SessionProvider>
                <ThemeProvider>
                    <App />
                    <Toaster />
                </ThemeProvider>
            </SessionProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
