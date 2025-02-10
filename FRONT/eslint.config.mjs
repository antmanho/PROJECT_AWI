import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Assure-toi d'importer le plugin TypeScript
import parser from "@typescript-eslint/parser"; // Importer le parseur TypeScript

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        jasmine: true, // Ajoute Jasmine comme global pour les tests
      },
      parser: parser, // Utilisation correcte du parseur dans "languageOptions"
      parserOptions: {
        ecmaVersion: 2020, // Prendre en charge les dernières fonctionnalités ECMAScript
        sourceType: "module", // Prendre en charge les modules
        ecmaFeatures: {
          jsx: true, // Si tu utilises JSX
        },
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint, // Associe le plugin TypeScript
    },
    rules: {
      // Règle pour signaler les variables inutilisées dans le code
      'no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': false
      }],
      '@typescript-eslint/no-explicit-any': 'off', // Désactiver les règles qui peuvent poser problème, comme celle-ci
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Si tu n'as pas de types explicites sur les modules
    },
  },
];

