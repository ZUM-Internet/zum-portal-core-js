/*
 **********************************************************
 *
 *                 Core 구현체 적용 설정파일
 *
 **********************************************************
 */
import Vue from 'vue';
import './monkeypatch';


/**
 * Global Error를 핸들링한 Vue 실행 함수
 * @param initFunction
 */
export function initializer(initFunction) {

  Vue.config.errorHandler = exceptionHandler.bind(this, initFunction);

  try {
    // 프로젝트 시작
    initFunction();
  } catch (e) {
    exceptionHandler(initFunction, e);
  }

}



/**
 * Vue.js 2 예외 핸들러.
 * SSR Hydration 및 Global Exception을 핸들링한다
 */
let restarted = false;
function exceptionHandler (initFunction, ...err) {
  console.error(`An unhandled Vue global error occurred!`, ...err);
  if (restarted) return;

  // 글로벌 예외 발생시 렌더링된 HTML 모두 제거하고 재시도
  setTimeout(() => {

    // #app이 이미 존재하면 제거
    const $app = document.querySelector('#app');
    if ($app) $app.remove();

    // #app 생성 후 삽입
    const $div = document.createElement("div");
    $div.id = 'app';
    document.body.appendChild($div);

    restarted = true;
    initFunction();

  }, 100);
}
