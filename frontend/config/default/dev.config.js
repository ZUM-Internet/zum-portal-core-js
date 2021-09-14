const useSSL = Boolean(process.env.SSL);
const port = useSSL ? 443 : Number(process.env.DEV_PORT || 3000);
const host = process.env.DEV_HOST || 'localhost';
const apiHost = process.env.API_HOST || 'localhost';
const apiPort = process.env.API_PORT || 8080;
const proxyPath = process.env.PROXY_PATH || '/api';

module.exports = {

  devServer: {
    host: host,
    port: port,
    open: true,
    disableHostCheck: true,
    https: useSSL,
    proxy: {
      // 프록시 요청을 보낼 api의 시작 부분
      [proxyPath]: {
        // 프록시 요청을 보낼 서버의 주소
        target: `http://${apiHost}:${apiPort}`
      }
    },
  },

};
