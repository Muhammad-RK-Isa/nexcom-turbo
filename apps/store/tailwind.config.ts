import type { Config } from "tailwindcss";

import baseConfig from "@nexcom/ui/tailwind.config";

export default {
  content: [
    ...baseConfig.content,
    "./src/**/*.{ts,tsx}",
  ],
  presets: [baseConfig],
} satisfies Config;
