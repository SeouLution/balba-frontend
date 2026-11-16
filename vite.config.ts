import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig.json 의 paths(@/*)를 그대로 읽어서 import 경로를 해석한다.
    tsconfigPaths: true,
  },
});
