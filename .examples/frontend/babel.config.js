/**
 **********************************************************
 *
 *                    Babel Preset 설정
 *              Vue CLI3 기본 설정을 사용한다
 *
 **********************************************************
 */
module.exports = {
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-optional-chaining"
  ],
  presets: [
    '@vue/app'
  ]
};
