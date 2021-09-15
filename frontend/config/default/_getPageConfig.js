const path = require("path");
const { getZumOptions } = require("../options");

const { resourcePath } = getZumOptions();

/**
 * 멀티 페이지 설정 함수.
 *
 * publish 모드에서도 동작하도록 페이지 설정을 오버라이딩한다
 *
 * @param vuePages
 * @returns {*}
 */
module.exports = {
  getPageConfig (vuePages) {
    const mode = process.env.ZUM_FRONT_MODE;

    Object.entries(vuePages)
      .filter(([, v]) => v.template)
      .forEach(([, page]) => {

        page.template = path.join(resourcePath, page.template);

        // SSR 모드인 경우 파일명 세팅 SSR 삽입
        if (mode === 'ssr') {
          page.entry = page.ssrEntry;
        }

        delete page.filename;

        if (mode === 'publish') {
          page.template = path.join(resourcePath, page.publishTemplate);
        }

      })

    return vuePages;
  }
}
