/*
 **********************************************************
 *
 *                 Core 구현체 적용 설정파일
 *
 **********************************************************
 */


var $vm;
var restarted = false;

/**
 * Global Error를 핸들링한 Vue 실행 함수
 * @param initFunction
 */
export function initializer(initFunction) {
  // 프로젝트 시작
  try {
    $vm = initFunction();
  } catch (e) {
    exceptionHandler(initFunction, e);
  }
}

export function monkeypatch () {
  require('./monkeypatch');
}


/**
 * Vue.js 2 예외 핸들러.
 * SSR Hydration 및 Global Exception을 핸들링한다
 */

function exceptionHandler(initFunction, err) {
  console.error('An unhandled Vue global error occurred!', err);
  if (restarted) return;

  // 에러 발생한 #app 제거
  console.log('Vue will restart!');
  if ($vm) $vm.$destroy();
  var $app = document.getElementById('#app');
  if ($app) { $app.innerHTML = ''; $app.remove(); }

  // #app 생성 후 삽입
  var $div = document.createElement("div");
  $div.id = 'app';
  document.body.appendChild($div);

  restarted = true;
  $vm = initFunction();
}
