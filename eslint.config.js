import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import reactCompiler from "eslint-plugin-react-compiler";
import prettierConfig from "eslint-config-prettier";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.react-router/**",
      "**/coverage/**",
      "**/.next/**",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    files: ["apps/frontend/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: path.join(__dirname, "apps/frontend"),
        project: true,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react-compiler/react-compiler": "error",
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "no-console": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    files: ["apps/backend/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: path.join(__dirname, "apps/backend"),
        project: true,
      },
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    files: ["apps/frontend/app/routes/**/*.{ts,tsx}", "apps/frontend/app/root.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["apps/frontend/tests/**/*.{ts,tsx}"],
    rules: {
      "react-compiler/react-compiler": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  prettierConfig,
);