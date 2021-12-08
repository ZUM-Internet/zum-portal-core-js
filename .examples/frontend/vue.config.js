const path = require('path');
const { modeConfigurer } = require('@zum-portal-core/frontend/config');
require('@zum-portal-core/banner'); // 배너출력

/**
 * 커스텀 Vue CLI 옵션
 * 필요에 따라 덮어 씌울 옵션을 설정한다.
 */
module.exports = modeConfigurer({
  paths: {
    packageJsonPath: path.resolve(__dirname, 'package.json'),
  },
});
