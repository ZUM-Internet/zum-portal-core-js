# CHANGELOG

## 2.0.0

- chore: 환경변수가 번들링 된 파일에 포함되어 노출되는 보안문제 수정 [49b45c8](https://github.com/zuminternet/zum-portal-core-js-project/commit/49b45c83a614fc285f7d949a3cb91baa4117a6ca) ygchoi
- chore: process.env의 구조 분해 할당 호환성 문제 수정 [45741fd](https://github.com/zuminternet/zum-portal-core-js-project/commit/45741fd7f97fc751b2aa65ec715db72d188277c7) ygchoi
- chore: 환경변수 기본값 중복 제거 [d4de6ed](https://github.com/zuminternet/zum-portal-core-js-project/commit/d4de6ed5e8cfcb427971a61ab82f13fe9fd2ff83) ygchoi
- chore: axios 번들링 이슈 관련 버전 범위 재지정 [d94af8f](https://github.com/zuminternet/zum-portal-core-js-project/commit/d94af8f55a5b41630b29e89b78eee626aaabcc7b) ygchoi

## 1.1.5

- fix: axios를 웹팩에서 주입하는 파일과 동일한 파일을 사용하도록 수정 [156f7b0](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/156f7b0f891df90d797cb22c453234f3054a1ff7) dogyeong
- chore: 빌드한 결과물 eslint 대상에서 제외 [881898a](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/881898a2a75ba03c894c69be16b78015d6c66cb0) dogyeong

## 1.1.4

- fix: vue-cli ssr빌드 관련 오류로 인해 axios import구문 수정 [bd744e6](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/bd744e65beeb71203d9e64efda58bbe587b3de9c) dogyeong

## 1.1.3

- Chore: rollup으로 lib 번들링 [82f9814](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/82f981441c7c56f6378683fd904b363fcab715d0) dogyeong
- refactor: lib 디렉토리 타입스크립트로 재작성 [060dccf](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/060dccf4b4eabf2cb7a057294d2c58598aa404e1) dogyeong
- fix: eslint Vue env 제거 [5c0484e](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/5c0484ecdb86878b21be8dcea8eb0d55f6a07060) dogyeong

## 1.1.2

- fix: page옵션에서 템플릿파일 경로 잘못 지정되는 버그 수정 [ff40376](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/ff4037646e8c62e67e0cf34e992bc4e5b9568d57) dogyeong

## 1.1.1

- refactor: cookieClient 코드 IE에 호환되도록 수정 [1436b96](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/1436b96be2dcd5fe1f43e9a3b3777819870b6713) dogyeong
- chore: eslint env에 Vue 추가 [38c46a8](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/38c46a8bed66e844e9e225f7e8a098776deb9b33) dogyeong

## 1.1.0

- feat: cookieClient remove메소드 추가 [83f2567](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/83f25679fd31f8ad41e5d2264eeab5905b124c88) dogyeong
- refactor: eslint, prettier 적용하여 리팩토링 [f47d2c3](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/f47d2c3d93da05ec01fe3ed2d0ef80f2a3765a4f) dogyeong

## 1.0.4

- feat: vue.config.js 파일에서 경로 옵션 전달할 수 있도록 수정 [6935a7d](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/6935a7df0cecc49ed7d106d503e23e82666a3010) dogyeong

## 1.0.3

- feat: sass-loader 추가 [63ff07c](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/63ff07cde09b1d4f5b6fe7beb7ada362bf2630c9) junilhwang
- feat: ssrEntry가 없을 경우, ssr build를 하지 않도록 옵션 추가 [33e2ed7](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/33e2ed764d6a0416b5cf97111f4e2561dc784229) junilhwang
- feat: 의존성 변경 [615cf23](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/615cf23b89a98ebd4147c1596ce43d765038d012) junilhwang
- feat: process env에 app version 주입할 수 있도록 작업 완료 [171a86c](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/171a86c02c6136f4d6e5a2d58d1312e43c9f8394) junilhwang

## 1.0.0-fix

- fix: Axios를 webpack에서 제공 [81c164e](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/81c164ee17a5a50f563be8f5552fd2c0cd9b9806) junilhwang
- fix: config 관련 오류 수정 (6) [48dbcdb](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/48dbcdbd41db5068fa8c94b1e9b49067ed6d1a10) junilhwang
- fix: config 관련 오류 수정 (5) [0a496e8](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/0a496e8ec8c98262084bd600853b3e6391fbe45d) junilhwang
- fix: config 관련 오류 수정 (4) [03ff384](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/03ff384139a8774540f4a715089f5605c717a331) junilhwang
- fix: config 관련 오류 수정 (3) [b4cf8ad](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/b4cf8ad8def044d9dfcf50691066f8e9bc62c33f) junilhwang
- fix: config 관련 오류 수정 [e588b11](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/e588b119f07255f12f3fecb0ef744e889634143f) junilhwang
- refactor: lib 리팩토링 [ac90930](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/ac9093040759f119eac8fe4a2c4102d8fd85cd9b) junilhwang
- fix: ts 제거 (import가 제대로 되지 않음) [976b04d](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/976b04d5cd556e23f3ffc3ab81801402cc3759b3) junilhwang

## 1.0.0

- fix: node-sass 버전 변경 [883208c](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/883208c12241bb3ccb04e97d2ec038553f3eaa0f) junilhwang
