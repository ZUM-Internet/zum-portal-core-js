const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const stubPath = global.ZUM_OPTION.stubPath;

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
		setup: function (app, server) {

			/**** 기본 미들웨어 등록 ****/
			// cookie parser
			app.use(cookieParser());
			// body parser
			app.use(express.json());
			app.use(express.urlencoded({ extended: true }));
			/***************************/

			// app.js 등록
			const stubAppPath = path.join(stubPath, './app');
			if (fs.existsSync(stubAppPath)) {
				require(stubAppPath)(app);
			}

			// public path
			const publicPath = process.env.publicPath;

			/**
			 * /stub으로 요청된 데이터 처리
			 */
			app.all(`${publicPath}stub/**`, (req, res) => {
				const data = require(path.join(stubPath, `../${req.path.replace(publicPath, '')}`));
				const method = Object.keys(data)
						.find(key => key.toUpperCase() === req.method);

				if (method) { // 메소드 함수가 존재시 실행된 결과 리턴
					res.send(data[method](req));

				} else { // 존재하지 않으면 데이터 전체를 리턴
					res.send(data);
				}
			});
		},

	}
};
