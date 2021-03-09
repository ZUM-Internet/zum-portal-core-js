require('reflect-metadata');
const path = require('path');
const {Caching} = require('../../backend/decorator/Caching');
const logger = require("../../backend/util/Logger").default;
const {ResourceType, ResourceLoader} = require("../../backend/util/ResourceLoader");
const {Scheduled} = require("../../backend/decorator/Scheduled");
const {attachMiddleWares} = require('../../backend/BaseAppContainer');
const {bundleRendering, createCookieJar} = require("../../backend/ssr/BundleRendering");
const {renderingUserAgent} = require('../../backend/ssr/RenderingUserAgent');
const {createBundleRenderer} = require("vue-server-renderer");
const cors = require('cors');


// express 객체 생성
const express = require('express');
const app = express();

attachMiddleWares(app); // 코어 기본 미들웨어 설치


// SSR 번들 렌더러 생성
const RESOURCES_PATH = path.join(process.env.INIT_CWD, process.env.BASE_PATH || '', 'resources');
const bundle = require(path.join(RESOURCES_PATH, 'vue-ssr-server-bundle.json'));
const clientManifest = require(path.join(RESOURCES_PATH, 'vue-ssr-client-manifest.json'));
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  clientManifest: clientManifest,
  template: `<html lang="ko"><body><!--vue-ssr-outlet--></body></html>`
});


// 캐싱테스트
const cachingFunction = Caching({}, function (id) {
  logger.log('executed function', id);
  return id;
});
app.get('/test', function (req, res) {
  res.json(cachingFunction(req.query.id || ''))
});


/**
 * CORS 요청 가능하도록 설정하는 예제
 *
 * 브라우저에서 아래 구문 실행시 확인 가능
 * fetch('http://localhost:8080/cors', {
 *   mode: 'cors'
 * }).then(res => res.json())
 * .then(console.log)
 *
 * @param req
 * @param res
 */
app.get('/cors', cors(), function (req, res) {
  res.json({hello: 'world'});
});


// 리소스 로더
app.get('/resource', function (req, res) {
  const world = ResourceLoader('world.js', ResourceType.JSON);
  const text = ResourceLoader('text.txt', ResourceType.FILE);
  res.send('js: ' + JSON.stringify(world) + '   text: ' + text);
});


// SSR 렌더링 결과 전송
app.get('/bundle', async function (req, res) {
  const domain = 'http://localhost:8080';

  try {
    // SSR은 CPU 사용이 큰 작업이므로 캐싱을 고려할 것

    console.time('start vue.js ssr rendering');

    const html = await bundleRendering(renderer, {
      projectDomain: domain,
      userAgent: renderingUserAgent.desktop.windowChrome,
      cookieJar: createCookieJar(domain, {}), // 쿠키 jar 생성
      windowObjects: {},
      rendererContext: {path: '/'}
    });
    console.timeEnd('start vue.js ssr rendering');

    res.send(html);

  } catch (e) {
    console.error(e);
    // 에러 발생시 프론트엔드에서 Vue.js를 기동할 수 있도록 기본 html 구문을 전송할 것
    res.send(`<html lang="ko"><body><div id="app"></div></body></html>`);
  }


});

app.listen(8080);




// 함수 스케줄링
Scheduled({cron: '*/3 * * * * *', runOnStart: true}, function () {
  logger.error('schedule!');
});
