/*
 **********************************************************
 *
 *                 Core 구현체 적용 설정파일
 *
 **********************************************************
 */
import Vue from 'vue';
import './monkeypatch';


let $vm;
let restarted = false;

/**
 * Global Error를 핸들링한 Vue 초기화 함수
 * 
 * @param initFunction Vue.JS 실행 함수. 
 *        Router, Vuex 생성 후 Vue 인스턴스를 리턴할 것
 */
export function initializer(initFunction) {
  Vue.config.errorHandler = exceptionHandler.bind(this, initFunction);

  // 프로젝트 시작
  try {
    $vm = initFunction();
  } catch (e) {
    exceptionHandler(initFunction, e);
  }
}


/**
 * Vue.js 2 예외 핸들러.
 * SSR Hydration 및 Global Exception을 핸들링한다
 */

function exceptionHandler(initFunction, ...err) {
  console.error(`An unhandled Vue global error occurred!`, ...err);
  if (restarted) return;

  // 에러 발생한 #app 제거
  console.log('Vue will restart!');
  if ($vm) $vm.$destroy();
  const $app = document.querySelector('#app');
  if ($app) $app.remove();

  // #app 생성 후 삽입
  const $div = document.createElement("div");
  $div.id = 'app';
  document.body.append($div);

  restarted = true;
  $vm = initFunction();
}
