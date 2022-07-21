module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: ['@zum-front-end/eslint-config-zum/vue', 'plugin:prettier/recommended'],
  exclude: ['./lib'],
};
