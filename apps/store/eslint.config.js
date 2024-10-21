import baseConfig, { restrictEnvAccess } from "@nexcom/eslint-config/base";
import nextjsConfig from "@nexcom/eslint-config/nextjs";
import reactConfig from "@nexcom/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
