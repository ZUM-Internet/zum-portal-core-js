const { join } = require("path");

const { INIT_CWD } = process.env;

const ZUM_OPTIONS = {
  frontSrcPath: join(INIT_CWD, 'src'),
  resourcePath: join(INIT_CWD, '../resources'),
  outputPath: join(INIT_CWD, '../resources'),
  stubPath: join(INIT_CWD, '../resources', 'stub'),
  publicPath: "/",
};

function getZumOptions () {
  return { ...ZUM_OPTIONS };
}

function getVuePages () {
  const { frontSrcPath } = getZumOptions();
  return require(frontSrcPath + '/vue.page');
}

function setZumOptions (newOptions) {
  Object.entries(newOptions)
        .filter(([ k ]) => ZUM_OPTIONS.hasOwnProperty(k))
        .forEach(([k, v]) => {
          ZUM_OPTIONS[k] = v;
        });
}

module.exports = {
  ZUM_OPTIONS,
  getZumOptions,
  getVuePages,
  setZumOptions,
}
