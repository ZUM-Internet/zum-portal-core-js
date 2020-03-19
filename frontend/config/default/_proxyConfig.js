/*
 **********************************************************
 *
 *           리버스 프록시 적용을 위한 함수
 *
 **********************************************************
*/

/**
 * 프록시 Response 처리 로직 수행 함수
 *
 * @param appendPaths html을 삽입할 Path 배열
 * @param entry
 * @param devHost Webpack Dev Server Host
 * @param backendHost Back-end Host
 * @param publicPath
 * @returns {Function}
 */
module.exports = function (pageElements,
                           devHost, backendHost,
                           publicPath = process.env.publicPath) {

  // 스크립트를 삽입할 Path 검사 정규식 생성 함수
  const generatePathRegex = (path) => new RegExp(
      path.map(str => str.replace(/(\/\*+)/g, ''))
          .map(str => str.replace(/\//g, '\/'))
          .map(str => `(${str})`)
          .join('|'),
      'gi');

  return function (proxyRes, request, response) {
    const body = [];

    // 헤더 Host 변경
    if (proxyRes.headers) {
      for (let field in proxyRes.headers) {
        if (!proxyRes.headers.hasOwnProperty(field)) continue;
        proxyRes.headers[field] = changeHost(proxyRes.headers[field], devHost, backendHost);
      }
    }


    const pageElemnt = Object.keys(pageElements).map(key => [key, pageElements[key]])
                             .find(([key, pageElemnt]) => generatePathRegex(pageElemnt.path).test(request.originalUrl));

    // 검사후 URL에 맞게 스크립트 삽입
    if (pageElemnt &&
        proxyRes.headers &&
        proxyRes.headers['content-type'] &&
        proxyRes.headers['content-type'].match('text/html')) {

    const scriptFilename = (`${publicPath}/${pageElemnt[0]}.js`).replace(/\/\//gi, '/');
    const appendScript = `<script src="${scriptFilename}"></script>`;

      proxyRes.on('data', chunk => body.push(chunk));
      proxyRes.on('end', () => {
        // http 스테이터스 코드 및 헤더 적용
        // response.writeHead(proxyRes.statusCode, proxyRes.headers);
        response.end(changeHost(appendScriptToHtml(Buffer.concat(body).toString(), appendScript),
            devHost, backendHost));
      });
    } else {
      proxyRes.on('data', chunk => body.push(chunk));
      proxyRes.on('end', () => response.end(changeHost(Buffer.concat(body).toString(), devHost, backendHost)));
    }



  }
};


/**
 * html 문자열내 `devHost` 문자열을 `backendHost` 문자열로 치환하는 함수
 *
 * @param target HTML 문자열 혹은 헤더 값
 * @param devHost 변경할 개발 환경 Host
 * @param backendHost 변경 대상인 백엔드 환경 Host
 * @returns {*}
 */
function changeHost(target, devHost, backendHost) {
  const regex = new RegExp(backendHost, 'gi');

  let replaced = target;
  if (target.replace) {
    replaced = target.replace(regex, devHost);

  } else if (target.map) {
    replaced = target.map(t => t.replace(regex, devHost));
  }

  return replaced;
}


/**
 * HTML 파일 마지막 라인에 스크립트를 추가하는 함수
 * @param html
 * @param script
 * @returns {*}
 */
function appendScriptToHtml(html, script) {
  if (html.includes('</body>')) {
    html = html.replace('</body>', script + '</body>');
  }
  return html;
}
