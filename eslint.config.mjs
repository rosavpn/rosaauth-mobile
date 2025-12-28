import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {
        ignores: [
            "**/node_modules/",
            "**/dist/",
            "**/android/",
            "**/ios/",
            "**/.expo/",
            "**/coverage/",
            "**/web-build/",
            "**/*.config.js"
        ]
    },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.es2021 } } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            "react-native": pluginReactNative,
        },
        rules: {
            ...pluginReactNative.configs.all.rules,
            "react-native/no-unused-styles": "warn",
            "react-native/split-platform-components": "off",
            "react-native/no-inline-styles": "off",
            "react-native/no-color-literals": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "react-native/sort-styles": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    }
];
