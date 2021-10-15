module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ecmaFeatures: {
    modules: true,
    spread: true,
    restParams: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-unused-vars': 0,
    'no-undef': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-empty-function': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
