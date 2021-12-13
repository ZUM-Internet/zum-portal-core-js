/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getZumOptions } = require('../options');

const { stubPath } = getZumOptions();

module.exports = {
  devServer: {
    port: 4000,
    open: true,
    disableHostCheck: true,

    /**
     * Webpack Dev Server에 프록시 기능을 구현하는 메소드
     *
     * Axios를 이용한 요청은 /stub 폴더 내의 js 파일을 사용하게 설정한다.
     * js 파일 내에 [get, post] 등과 같은 request method 함수가 있는 경우는 실행 결과를,
     * JSON 객체인 경우 객체 전체를 반환한다.
     *
     * @param app
     * @param server
     */
    setup(app, server) {
      /**** 기본 미들웨어 등록 ****/
      // cookie parser
      app.use(cookieParser());
      // body parser
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      /***************************/

      /**
       * /stub으로 요청된 데이터 처리
       */
      app.get(`*stub/:stubPath(*)`, (req, res, next) => {
        try {
          const data = require(path.join(stubPath, `${req.params.stubPath}.json`));
          return res.send(data);
        } catch (e) {
          next();
        }
      });

      // app.js 등록
      const stubAppPath = path.join(stubPath, './app.js');

      if (fs.existsSync(stubAppPath)) {
        require(stubAppPath)(app);
      }
    },
  },
};
