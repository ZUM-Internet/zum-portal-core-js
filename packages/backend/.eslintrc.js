module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['@zum-front-core/eslint-config-zum', 'plugin:prettier/recommended'],
  rules: {
    'prefer-promise-reject-errors': 0,
  },
};
