module.exports = {
  root: true,
  env: { node: true },
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['@zum-portal-core/eslint-config-zum', 'plugin:prettier/recommended'],
  rules: {},
};
