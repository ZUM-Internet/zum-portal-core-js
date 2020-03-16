/**
 * 멀티 페이지 설정 함수.
 *
 * publish 모드에서도 동작하도록 페이지 설정을 오버라이딩한다
 *
 * @param pageObj
 * @returns {*}
 */
module.exports = function getPageConfig(pageObj) {
  const mode = process.env.ZUM_FRONT_MODE;

  Object.keys(pageObj)
      .forEach(key => {
        if (mode === 'ssr') { // SSR 모드인 경우 파일명 세팅 SSR 삽입
          pageObj[key].entry = pageObj[key].ssrEntry;
          if (!pageObj[key].entry) { // ssr Entry가 없는 것 제외
            return delete pageObj[key];
          }
        }
        pageObj[key].template = 'resources/' + pageObj[key].template;

        if (mode === 'publish') {
          pageObj[key].template = 'resources/' + pageObj[key].publishTemplate || pageObj[key].template;
          delete pageObj[key].filename;
        }

      });

  return pageObj;
}
