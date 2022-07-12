# @zum-front-end/backend

- `BFF(Backend For Frontend)`개발을 할 때 공통적으로 필요한 기능들을 모아놓은 패키지
- `TypeScript` + `Nest.js` + `Express` 기반으로 개발

## BaseAppContainer

- 기본적인 미들웨어, 템플릿엔진 등을 설정하고 앱을 구동시키는 클래스
- 각 프로젝트에서는 BaseAppContainer를 상속받아서 구현한다

```ts
import { BaseAppContainer, NestExpressApplication } from '@zum-front-end/backend';
import { AppModule } from './app.module';

class AppContainer extends BaseAppContainer {
  public listen(app: NestExpressApplication) {
    const port = 8080;

    return app.listen(port, () => {
      console.log('App Startup!');
    });
  }
}

new AppContainer().setup(AppModule);
```

### `setup()`

- 앱을 구동시키는 메소드
- 첫 번째 파라미터로 nestjs app 모듈을 전달해야 한다
- 두 번째 파라미터는 옵션값으로, 폴더의 경로나 ejs delimiter 설정을 할 수 있다

### `listen()`

- 앱 구동 로직에서 가장 마지막 단계에 호출되는 메소드
- BaseAppContainer에서는 추상 메소드로 정의되어 있고, 상속받는 클래스에서 구현하여 사용한다
- 첫 번째 파라미터로 express app객체를 받는다

## zum-cache

- 메소드를 주기적으로 호출하는 cron작업과, 메소드의 반환값을 캐싱하는 기능을 제공하는 데코레이터

```ts
import { ZumCache } from '@zum-front-end/backend';

export class ApiService {
  @ZumCache({
    cron: '*/15 * * * * *',
    key: 'api-fetch-sth',
    ttl: 60,
    validate: (v) => typeof v === 'object',
    logger: (v) => console.log(v),
  })
  public fetchSomething() {
    // ...
  }
}
```

### ZumCache 옵션

| name       | type                  | required |
| ---------- | --------------------- | -------- |
| `cron`     | `string`              | X        |
| `key`      | `string`              | X        |
| `ttl`      | `number`              | X        |
| `validate` | `(v: any) => boolean` | X        |
| `logger`   | `(v: any) => any`     | X        |

- `cron`: 메소드가 호출될 주기를 나타낸다. `cron expression` 형태의 문자열을 받으며, 생략한 경우 cron작업을 수행하지 않는다
- `key`: 캐싱에 사용되는 key값을 나타낸다. 생략하면 클래스이름, 메소드이름, 메소드의 파라미터를 기반으로 자동으로 key를 생성한다
- `ttl`: 캐싱된 값의 유효시간을 나타낸다. 기본값은 `Infinity`.
- `validate`: 유효성 검증을 위한 함수. 파라미터로 메소드의 리턴값이 들어오며, validate함수의 결과가 truthy해야 캐싱처리가 되며 falsy한 경우, 기존의 캐싱된 값을 대신 반환한다. 생략한 경우 기본값으로 `Boolean` 생성자가 사용된다.
- `logger`: 로깅을 위한 함수

## adapter

- API 호출과정에서 공통적으로 처리해야 하는 기능들을 모아놓은 모듈
- `axios` 기반으로 작성

```ts
import { ZumProvisionAdapter } from '@zum-front-end/backend';

type ResponseType = any;

export class ApiService {
  constructor(private readonly adapter: ZumProvisionAdapter) {}

  public async fetchSomething() {
    const { data } = await this.adapter.get<ResponseType>({
      url: 'https://api.zum.com',
      version: '1.0',
      params: {},
      stub: {},
      typePredicate: (value) => Object.hasOwn(value, 'item'),
    });

    return data;
  }
}
```

### adapter 옵션

| name            | type                            | required | description                         |
| --------------- | ------------------------------- | -------- | ----------------------------------- |
| `url`           | `string`                        | O        | 요청 URL                            |
| `version`       | `string`                        | X        | 요청 버전                           |
| `params`        | `AxiosRequestConfig['params']`  | X        | 요청 파라미터                       |
| `data`          | `AxiosRequestConfig['data']`    | X        | 요청 데이터                         |
| `header`        | `AxiosRequestConfig['headers']` | X        | 요청 헤더                           |
| `stub`          | `Record<any, any>`              | X        | publish 모드에서 사용할 stub 데이터 |
| `timeout`       | `number`                        | X        | timeout 지정                        |
| `typePredicate` | `(v: T) => boolean`             | X        | 응답 데이터 타입 체크 함수          |

## ssr

- vue ssr을 수행하는 모듈

```ts
import { bundleRendering, createCookieJar, renderingUserAgent } from '@zum-front-end/backend';
import { BundleRenderer, createBundleRenderer } from 'vue-server-renderer';
import * as fs from 'fs';

// SSR에 필요한 파일들 import
const template = fs.readFileSync('/resources/templates/ssr_index.html');
const clientManifest = await import('/resources/vue-ssr-client-manifest.json');
const bundle = await import('/resources/vue-ssr-server-bundle.json');

// 렌더러 생성
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  clientManifest,
  template,
  inject: false, // 템플릿에 직접 inject처리
});

// 클라이언트로 전달할 데이터
const winObj = {
  commonResponse: await this.commonService.fetchContent(),
  ssrMode: process.env.SSR_MODE, // 'prod' or 'qa'
};
const DOMAIN = 'https://zum.com';

// SSR 수행
const ssrHtml = await bundleRendering(renderer, {
  projectDomain: DOMAIN,
  userAgent: renderingUserAgent.desktop.windowChrome,
  cookieJar: createCookieJar(DOMAIN, {}), // 쿠키 jar 생성
  windowObjects: winObj,
  rendererContext: { path: '/' },
});
```

## util

유틸함수 모음. 현재는 logger만 쓰고 있음

```ts
import { logger } from '@zum-front-end/backend';

logger.info();
logger.debug();
logger.log();
logger.warn();
logger.error();
```
