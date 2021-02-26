'use strict';
/*
 **********************************************************
 *
 *     publish 모드에서 적용할 express controller 옵션
 *
 * context path 및 stub path를 설정하지 않으므로 직접 확인하여 등록하여야 한다.
 * ex) 프론트엔드 /api/test => /stub/api/test 등록
 * 
 **********************************************************
 */
module.exports = function (app) {

  // 예시
  // app.get('stub/news/shoppingbox', (req, res) => {
  //   res.send(shoppingBox);
  // });

};
