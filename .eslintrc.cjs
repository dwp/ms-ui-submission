module.exports = {
  root: true,
  extends: ['@dwp/eslint-config-base', 'plugin:import/recommended'],
  env: {
    node: true,
  },
  plugins: [
    "security",
    "jsdoc",
    "sonarjs"
  ],
  rules: {
    'jsdoc/require-description-complete-sentence': 0
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    requireConfigFile: false,
  },
  ignorePatterns: ['test/**/*.test.js', 'test/**/*.spec.js', '**-reports/**', 'dist/**'],
};
