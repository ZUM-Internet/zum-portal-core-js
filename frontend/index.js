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
  let restarted = false;

  Vue.config.errorHandler = function (err, vm, info) {
    console.error(`An unhandled Vue global error occurred!`, err, vm, info);
    if (restarted) return;

    // 글로벌 예외 발생시 렌더링된 HTML 모두 제거하고 재시도
    document.querySelector('#app').remove();
    const $div = document.createElement("div");
    $div.id = 'app';
    document.body.appendChild($div);

    restarted = true;
    initFunction();
  };

// 프로젝트 시작
  initFunction();
}
