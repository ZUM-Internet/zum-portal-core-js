/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');

const { INIT_CWD } = process.env;

const ZUM_OPTIONS = {
  frontSrcPath: join(INIT_CWD, 'src'),
  resourcePath: join(INIT_CWD, '../resources'),
  outputPath: join(INIT_CWD, '../resources'),
  stubPath: join(INIT_CWD, '../resources', 'stub'),
  publicPath: '/',
  packageJsonPath: join(process.cwd(), '../package.json'),
};

function getZumOptions() {
  return { ...ZUM_OPTIONS };
}

function getVuePages() {
  const { frontSrcPath } = getZumOptions();
  return require(frontSrcPath + '/vue.page');
}

function setZumOptions(newOptions) {
  Object.entries(newOptions)
    .filter(([k]) => ({}.hasOwnProperty.call(ZUM_OPTIONS, k)))
    .forEach(([k, v]) => {
      ZUM_OPTIONS[k] = v;
    });
}

module.exports = {
  ZUM_OPTIONS,
  getZumOptions,
  getVuePages,
  setZumOptions,
};
