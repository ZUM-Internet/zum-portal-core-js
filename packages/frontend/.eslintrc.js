module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: ['@zum-front-core/eslint-config-zum/vue', 'plugin:prettier/recommended'],
  exclude: ['./lib'],
};
