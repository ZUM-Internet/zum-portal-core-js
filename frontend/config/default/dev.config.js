const {createProxyMiddleware} = require('http-proxy-middleware');
const proxyConfig = require('./_proxyConfig');
const frontSrcPath = global.ZUM_OPTION.frontSrcPath;
const page = require(frontSrcPath + '/vue.page');
const useSSL = Boolean(process.env.SSL);
const port = useSSL ? 443 : Number(process.env.DEV_PORT || 3000);
const host = process.env.DEV_HOST || 'localhost'

module.exports = {

  devServer: {
    host: host,
    port: port,
    open: true,
    disableHostCheck: true,

    /**
     * Webpack Dev Server에 리버스 프록시 기능을 구현하는 메소드
     *
     * Dev Server가 Reverse proxy 서버가 되어 모든 요청을 `localhost:8080`으로 전달하고
     * 받은 응답이 html인 경우 JS를 삽입한다.
     *
     * @param app
     * @param server
     */
    setup: function (app, server) {

      // 프록시 객체 생성
      const proxyFunction = createProxyMiddleware({
        target: 'http://localhost:8080',
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyRes: proxyConfig(page, `${host}:${port}`, 'localhost:8080'),
      });

      // 프록시 처리
      app.use('/**', (req, res, next) => {

        // .js 혹은 static 요소는 프록시 적용하지 않음
        if (req.originalUrl.includes(`.js`) || req.originalUrl.includes(`/static`)) {
          return next();
        }

        return proxyFunction(req, res, next);
      });


    }
  }
};
