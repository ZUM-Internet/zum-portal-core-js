/**
 **********************************************************
 *
 *                 Vue 페이지 설정
 *
 *     뷰 엔트리 포인트가 여러개인 경우 설정하여 사용한다.
 *     특별한 경우가 아니라면 멀티페이지가 아닌 SPA로 구성할 것.
 *
 **********************************************************
 */

module.exports = {

  abtest: { // 메인
    entry: 'src/abtest/main.js',
    ssrEntry: 'src/abtest/ssr_main.js',
    template: '../templates/index.html', // 원본 템플릿 파일
    publishTemplate: 'stub/index.html', // 퍼블리시 모드에서 사용할 템플릿 파일
    filename: '../templates/dist/index.html', // 빌드 후 템플릿 파일
    path: ['/*'] // dev 모드 프록시에 적용할 path
  },

};

