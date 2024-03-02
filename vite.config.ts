import react from "@vitejs/plugin-react";
import million from "million/compiler";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [million.vite({ auto: true }), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
