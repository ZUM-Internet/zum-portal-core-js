/*
 **********************************************************
 *
 *                Axios Monkey patch 로직
 *
 *          퍼블리시 모드로 기동시 모든 데이터를
 *           stub 폴더에서 가져오도록 구성한다
 *
 * process.env.NODE_ENV 체크 구문이 있어야 번들링시 코드가 제거된다
 *
 **********************************************************
 */
if (process.env.NODE_ENV !== 'production' && process.env.ZUM_FRONT_MODE === 'publish') {
  const regex = /^.*\/\/[^\/]+:?[0-9]?\//i;

  ['request', 'get',
    'delete', 'head', 'options',
    'post', 'put', 'patch'].forEach(method => {

    /**
     * axios 몽키패칭
     *
     * @param url 기본 URL
     * @param args 그 외 옵션
     */
    const _method = Axios[method];
    Axios[method] = function (url, ...args) {
      if (url.includes('http')) { // 외부 호출인 경우 패칭하지 않음
        return _method(url, ...args);
      }

      // URL 패칭 이후 js 파일 로드
      let paredUrl = `${url.replace(regex, '')}`;
      if (paredUrl.charAt(0) !== '/') {
        paredUrl = '/' + paredUrl;
      }
      return _method(`${process.env.publicPath}stub${paredUrl}`, ...args);
    };

  });
}
