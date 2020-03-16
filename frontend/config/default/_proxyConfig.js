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
module.exports = function (appendPaths,
                           entry,
                           devHost, backendHost,
                           publicPath = process.env.publicPath) {

  // 스크립트를 삽입할 Path 검사 정규식 생성
  const joinedPath = appendPaths.map(str => str.replace(/(\/\*+)/g, ''))
      .map(str => `(${str})`)
      .join('|');
  const appendHtmlRegex = new RegExp(joinedPath, 'gi');

  // 삽입할 스크립트
  const script = entryToScript(publicPath, entry);

  return function (proxyRes, request, response) {
    const body = [];

    // 헤더 Host 변경
    if (proxyRes.headers) {
      for (let field in proxyRes.headers) {
        if (!proxyRes.headers.hasOwnProperty(field)) continue;
        proxyRes.headers[field] = changeHost(proxyRes.headers[field], devHost, backendHost);
      }
    }

    if (appendHtmlRegex.test(request.originalUrl) &&
        proxyRes.headers &&
        proxyRes.headers['content-type'] &&
        proxyRes.headers['content-type'].match('text/html')) {

      proxyRes.on('data', chunk => body.push(chunk));
      proxyRes.on('end', () => {
        // http 스테이터스 코드 및 헤더 적용
        // response.writeHead(proxyRes.statusCode, proxyRes.headers);
        response.end(changeHost(appendScriptToHtml(Buffer.concat(body).toString(), script),
            devHost, backendHost))
      });
    } else {
      proxyRes.on('data', chunk => body.push(chunk));
      proxyRes.on('end', () => response.end(changeHost(Buffer.concat(body).toString('utf8'), devHost, backendHost)));
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

/**
 * 엔트리 포인트를 스크립트 태그로 리턴하는 함수
 * @param publicPath js파일의 경로
 * @param entry {Array|Object|String} js파일이 될 엔트리 포인트
 * @returns {*}
 */
function entryToScript(publicPath, entry) {
  let files;

  if (entry instanceof Array) {
    files = entry.map(key => key + '.js');

  } else if (entry instanceof Object) {
    files = Object.keys(entry).map(key => key + '.js');

  } else {
    files = [files];
  }

  return files.map(name => `<script src="${publicPath}${name}"></script>`)
      .join('');
}
