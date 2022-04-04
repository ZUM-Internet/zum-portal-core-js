# @zum-front-core/frontend

프론트엔드 개발을 하면서 공통적으로 사용되는 옵션, 라이브러리들을 모아놓은 패키지. 크게 두 가지로 나눌 수 있다

- [modeConfigurer](#modeconfigurer)
- [lib](#lib)

## modeConfigurer

`vue.config.js`에서 `vue-cli` 옵션을 주입하여 다양한 기능들을 설정한다

- 프로젝트 요소별 경로 설정
- 환경변수별 기본동작 설정
  - 개발모드에서 개발서버(프록시서버) 설정
  - 퍼블리시모드에서 stub데이터 설정
- path alias 설정
- 전역 라이브러리 주입
- ssr 관련 설정
- 페이지 관련 설정

### 기본 사용법

```js
// vue.config.js
const { modeConfigurer } = require('@zum-front-core/frontend/config');

const options = {
  /* options */
};

module.exports = modeConfigurer(options);
```

### 옵션

**`options`**

옵션 값들을 담은 객체. 기본적으로 `vue-cli@4`의 config로 전달된다.

**`options.paths`**

`package.json`이나 각 폴더의 위치를 명시할 수 있는 옵션. 사용하는 프로젝트의 상황에 맞게 설정하여 사용하면 된다.

## lib

자주 쓰는 라이브러리를 한번 래핑한 모듈들

- `cookieClient`
  - `axios`를 래핑
- `ResClient`
  - `js-cookie`를 래핑

### 기본 사용법

```js
import { RestClient, cookieClient } from '@zum-front-core/lib';

/* RestClient */
const rest = new RestClient('/api');
rest.get('/products');

/* cookieClient */
// get
const cookeyVal = cookieClient.get('cookie-key');

// set
cookieClient.set('cookie-key2');

// remove
cookieClient.remove('cookie-key2');
```
