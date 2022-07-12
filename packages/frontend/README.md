# @zum-front-end/frontend

프론트엔드 개발을 하면서 공통적으로 사용되는 옵션, 라이브러리들을 모아놓은 패키지. 크게 두 가지로 나눌 수 있다

1. [modeConfigurer](#modeconfigurer)
1. [lib](#lib)

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
const { modeConfigurer } = require('@zum-front-end/frontend/config');

const options = {
  /* options */
};

module.exports = modeConfigurer(options);
```

### `modeConfigurer` 옵션

**`options`**

옵션 값들을 담은 객체. 기본 옵션과 merge되어 `vue-cli@4`의 config로 전달된다.

**`options.paths`**

`package.json`이나 각 폴더의 위치를 명시할 수 있는 옵션. 사용하는 프로젝트의 상황에 맞게 설정하여 사용하면 된다.

- `frontSrcPath`
- `resourcePath`
- `outputPath`
- `stubPath`
- `publicPath`
- `packageJsonPath`

### 환경변수

`process.env`에 설정해주면 된다

- `NODE_ENV`: `"development"` | `"production"`
  - 개발모드인지 운영모드인지 명시
  - 값이 없으면 `"development"`로 간주
- `ZUM_FRONT_MODE`: `"publish"` | `"dev"` | `"ssr"`
  - 클라이언트에서 렌더링 방식을 지정
  - 값에 따라 웹팩 옵션이 다르게 설정된다
  - `"publish"`일 때 stub 설정이 추가된다
- `INIT_CWD`: `string`
  - 경로 설정에 있어 기본값들의 base경로
- `SSL`: `"true"` | `null`
  - 개발서버에서 ssl을 사용할 것인지 정의
- `DEV_PORT`: `number` | `null`
  - 개발서버에서 사용할 포트 정의
  - 기본값은 ssl사용하면 `443`, 사용하지 않으면 `3000`
- `DEV_HOST`: `number` | `null`
  - 개발서버에서 사용할 호스트 정의
  - 기본값은 `localhost`
- `API_HOST`: `string` | `null`
  - 개발서버에서 사용할 API서버 호스트 정의
  - 기본값은 `localhost`
- `API_PORT`: `number` | `null`
  - 개발서버에서 사용할 API서버 포트 정의
  - 기본값은 `8080`
- `PROXY_PATH`: `string` | `null`
  - 개발서버에서 사용할 API 프록시 주소 정의
  - 기본값은 `/api`

### path alias

```js
// _getDefaultCliOption.js
config.resolve.alias.set('#', resourcePath);
config.resolve.alias.set('@', frontSrcPath);
```

### 전역 라이브러리/값 주입

주입해준 값은 전역에서 접근 가능

```js
// _getDefaultCliOption.js
config.output
  .jsonpFunction('zumPortalJsonp')
  .end()
  .plugin('provide')
  .use(ProvidePlugin, [{ Axios: 'axios/dist/axios.min.js' }])
  .end()
  .plugin('define')
  .use(DefinePlugin, [{ 'process.env': JSON.stringify({ ...process.env, APP_VERSION }) }])
  .end();
```

## `lib`

자주 쓰는 라이브러리를 한번 래핑한 모듈들

- `cookieClient`
  - `axios`를 래핑
- `ResClient`
  - `js-cookie`를 래핑

### 기본 사용법

```js
import { RestClient, cookieClient } from '@zum-front-end/lib';

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
