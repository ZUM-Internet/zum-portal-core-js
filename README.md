Express-Core Project
===
## Node.js Express 기반, Typescript를 적용하고 편의를 위한 데코레이터를 추가 개발
1. MS의 (tsyring)[https://github.com/microsoft/tsyringe] 컨테이너를 이용하여 싱글톤 기반으로 구현한다.
1. (node-schedule)[https://github.com/node-schedule/node-schedule], (node-cache)[https://github.com/node-cache/node-cache] 등의 라이브러리를 이용하여
포털 개발팀에서 자주 사용되는 패턴을 간단하게 사용하는 것을 목표로 한다.  


## process.env 플래그
1. ENABLE_WHATAP: 'true' | null  
와탭 모니터링 에이전트 실행 (세부 옵션은 (공식 가이드)[https://docs.whatap.io/kr/agent_node/] 참조)
2. ZUM_BACK_MODE: 'publish' | 'deploy'  
줌 어댑터에서 stub 파일 사용 여부 결정
3. ZUM_FRONT_MODE: 'ssr' | null  
프론트엔드 번들링 시 ssr 플러그인 삽입 여부 결정
4.  BASE_PATH: string
실행할 프로젝트 기본 디렉토리 

---

## 1. 변경 내역

- 1.1.2
  - ENABLE_WHATAP 플래그 추가. 'true' 입력시 와탭 모니터링 에이전트 실행
  - 커스텀 데코레이터 기능 재개발
    - 장애 발생으로 제거하였던 기능으로 재개발 진행 (Component.ts 파일 수정)
  - 프론트엔드 AB테스트 컴포넌트 '그룹'으로 수정

- 1.1.1
  - 

- 1.1.0
  - 미들웨어 함수(람다) 사용 가능하도록 추가
  - 바닐라 Node.js express에서 사용 가능하도록 exporting
  - Sentry 추가.
    - application.yml 파일 내 DSN 옵션이 있는 경우 활성화됨
    
    ```yml
    default:
      sentry:
        dsn: 'https://b31b56d0ecd846eab9b6153797a594d1@o345995.ingest.sentry.io/5374955'
        request: ''
        serverName: true
        transaction: ''
        user: ''
        ip: false
        version: false
        flushTimeout: 1000
    ```
    
  - 커스텀 데코레이터 before, after 추가
    - .examples/decorator 폴더의 예시 파일 참조
    
  - ABTest 관련 코드 추가
  

  
- 1.0.9
  - API 핸들러 규칙 추가 (/api 순위↑, * 포함시 순위↓)
  
- 1.0.8
  - 로거 ISO String의 T/Z 문자 제거
  
- 1.0.7
  - Caching expire 관련 버그 수정
  - Vue SSR ClientManifest 관련 기능 수정

- 1.0.5
  - 프론트엔드 프록시 버그 수정 

- 1.0.4
  - 프론트엔드 뷰 initalizer 수정 (spread operator 제거)
  - 프론트엔드 Cli Option에서 fork-ts-checker 제거.<br>해당 플러그인이 tsconfig를 무시하게 만들어 제거함
  
- 1.0.3
  - AppContainer와 Controller 메소드(*Mapping 데코레이터 메소드)에 사용할 수 있는 
    @Middleware(RequestHandler|RequestHandler[]) 데코레이터 추가
  - 미들웨어 추가시 @Middleware 데코레이터 사용을 권장
  - favicon.ico 요청시 Fatal Error 메시지 노출하지 않도록 수정
  - @Caching 데코레이터에서 DeepFreeze 로직을 중복 호출하는 문제 수정 (반환시에만 Freeze)
  - @Caching를 적용한 메소드의 결과가 null일때 동시 호출하면 여러번 호출되던 문제 수정
  - ResourceLoader 유틸 함수 require에서 fs 모듈로 변경

- 1.0.2
  - 프론트엔드 dev모드 프록시에서 status 무시하는 현상, content-length 짤리는 문제 수정
  - @Controller에서 URL 등록시 긴 URL 핸들링을 우선하여 적용

---

## 2. 접근방법

1. 줌인터넷 넥서스 로그인
   - `npm login --registry=http://ci-portal.zuminternet.com/nexus/repository/zum-portal-core-js/`  
   - `ID`: zum-portal-dev 
   - `PW`: [비밀번호는 여기서 확인](https://docs.google.com/spreadsheets/d/1LFne8K8P60N4Ptz6SETKr1Oqzi1nmt7bG3fxWAVPdvk/edit#gid=0)
  
2. typescript 컴파일 
   - `npm run build` 명령어로 컴파일
  
3. 배포
   - `npm publish`

---

## 3. 사용 방법

### (1) 기본 설정

1. `global.ZUM_OPTION`
    프론트엔드 줌 코어 옵션
    - `frontSrcPath`
        프론트엔드 소스 폴더 위치. 기본값 process.env.INIT_CWD/frontend
    - `resourcePath`
        프론트엔드 리소스 폴더 위치. 기본값 process.env.INIT_CWD/frontend/resources 
    - `outputPath`
        프론트엔드 번들링 결과 폴더 위치. 기본값 process.env.INIT_CWD/frontend/resources
    - `stubPath`
        프론트엔드 publish 모드에서 stub 데이터 위치. 기본값 resourcePath/stub
1. `process.env.ZUM_FRONT_MODE`
    프론트엔드 기동 모드. [dev/publish/ssr/undefined] undefined의 경우 빌드시에만 사용할 것

#### 1) 백엔드

- 코어 적용 및 서버 구동
  - 백엔드 프로젝트에서 Express.js 어플리케이션 컨테이너인 AppContainer 클래스에 BaseAppContainer 추상 클래스를 상속받는다.
  - 백엔드 프로젝트 시작을 위해 작성하는 Server.ts 파일에서 AppContainer를 import 할 수 있도록 AppContainer에 export 구문을 작성한다
  
  ```ts
  /**
   * 이 구문은 tsyring 컨테이너에 추가된 AppContainer 객체를 export하는 구문으로,
   * Server.ts에서는 해당 객체를 이용하여 서버측 어플리케이션을 실행할 수 있다.
   */
  export const appContainer = container.resolve(AppContainer);
  ```
  
- `resources/application.yml`  
  - **서버 구동을 위해 반드시 필요**하다.
  - yml 확장자를 가진 파일은 생성자에서
    `@Yml('파일명') private YML_NAME: any`
    구문으로 객체화하여 컨텍스트에 주입하여 `this.YML_NAME.test.value` 처럼 사용할 수 있다.

```yml
# 각 모드별로 적용될 옵션. default에 development / production 값이 덮어씌워진다
default:
  # 백엔드 라우터의 기본 URL을 지정할 수 있다. 없어도 무방하다. 
  publicPath: '/'

  # 서버가 실행될 포트. application.yml 파일에서 자동으로 체크하여
  port: 8080
  
  # 센트리 설정 옵션
  sentry: 
    dsn: 'https://b31b56d0ecd846eab9b6153797a594d1@o345995.ingest.sentry.io/5374955...' # 센트리 DSN 값
    request: ''
    serverName: true
    transaction: ''
    user: ''
    ip: false
    version: false
    flushTimeout: 1000

development:

production:

```

#### 2) 프론트엔드
1. `vue.config.js`
**index**: 프론트엔드의 dev/publish 모드 등 기본 설정을 적용하는 함수
  - `publicPath`: 프론트엔드 Vue.js 라우터의 기본 URL을 지정
  
0. path shortcut
  - `@`: process.env.FRONTEND_PATH/assets
  - `#`: process.env.RESOUCES_PATH

### (2) 엔트리 포인트(BaseAppContainer)

생성자로 다음과 같은 객체를 입력받음
```ts
interface BaseAppContainerProps {
    initMiddleWares?: Array<RequestHandler> // 0순위로 설치할 미들웨어 함수 배열
    dirname?: string // 컴포넌트를 스캔할 기본 디렉토리 (상대주소)
}
```

다음과 같이 사용
```ts
import BaseAppContainer from "./BaseAppContainer";

class AppContainer extends BaseAppContainer {
  constructor() {
    super({
      initMiddleWares: [], // 0순위로 설치할 미들웨어 함수 배열
      dirname: './backend' // 컴포넌트를 스캔할 기본 디렉토리 (상대주소)     
    });
  }
}
```

### (3) 유틸성 객체 및 함수
1. `Logger`: winston logger를 이용하여 로그를 남길때 사용한다.
2. `ResourceLoader`, `ResourcePath`: **/resources** 디렉토리 내의 파일을 가져올 때 사용한다.

### (4) 데코레이터 목록
1. `@Controller`: Request Mapping을 위해 사용하는 컨트롤러 클래스에 사용한다.
    1. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: 데코레이팅한 메소드를 http 요청에 핸들링한다.
    1. `@Middleware`: 핸들러에 미들웨어를 삽입한다.
1. `@Component`: 기능을 담당하는 클래스임을 표기한다. 설정시 singleton 객체로 등록된다.
    1. `@PostConstructor`: 생성자 실행 이후 실행되는 메소드. 생성자에서 불가능한 async 작업 등을 수행한다.
    1. `@Caching`: 해당 메소드의 반환값을 캐시한다. 결과값은 deepFreeze 상태로 변경이 불가능하다. 캐시 키의 기본값은 메소드명이므로 같은 메소드명을 사용 시에는 키를 직접 작성해야한다.
    1. `@Scheduled`: 해당 메소드를 일정 시간마다 실행한다.
    1. `@Inject`: Component의 constructor에서 사용 가능한 데코레이터로 파라미터에 해당하는 객체를 주입받는다.
    1. `@Yml`: Component의 constructor에서 사용 가능한 데코레이터로 파일명에 해당하는 yml 객체를 주입받는다.
    
1. `@Component의 Alias`: @Component는 아래와 같은 이름으로도 사용할 수 있다.
    1. `@Service`
    1. `@Scheduler`
    1. `@Singleton`
    1. `@Injectable`
    1. `@Facade`

### (5) SSR 사용하기

#### 1) SSR시 사용 가능한 객체 및 함수

1. `bundleRendering`: Vue Server Renderer 객체를 받아 `JSDOM`을 활용, 렌더링하고 결과를 반환하는 함수
1. `createCookieJar`: `JSDOM`에 적용할 수 있는 CookieJar 생성 함수
1. `renderingUserAgent`: `JSDOM`에 적용할 브라우저별 user agent

#### 2) SSR 사용시 백엔드 -> 프론트엔드 Vuex Store 연동
1. 프론트엔드 main.js (엔트리 포인트)에 아래 구문을 작성할 것 단, **clientManifest 파일 사용시에만 작동**

```js
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

### (6) 아키텍처 설계
1. 아키텍처는 도메인 서비스에 맞게 자유롭게 작성한다.
1. 필요에 따라 본 코어 프로젝트에서 사용하는 @Component 계열 데코레이터를 사용하지 않고 Express.js 기본 문법으로 작성해도 무관하다.
1. 하지만 기본적인 웹 서비스 패턴을 따르고 유지보수성을 증대하기 위해 코어 프로젝트에서 사용하는 데코레이터를 사용하는것을 권장한다. 

### (7) EJS 템플릿 엔진
1. 대부분의 데이터는 프론트엔드에서 처리하지만 SSR 후 HTML 태그 삽입이나 데이터 전달을 위해 사용한다.
1. <% %> 형태의 기본 문법 사용시 웹팩 플러그인과 충돌하여 <? ?> 태그로 변경 처리되어 있다.
![change delimieter](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/raw/master/change_delimeter.png)  
InteliJ의 EJS 플러그인에 위 옵션을 적용하여 템플릿 문법을 사용할 수 있다.


### (8) ABTest 설정하기

#### 1) Backend

```ts
/** 1. Middleware 추가 **/
import {Component} from "zum-portal-core/backend/decorator/Component";
import {putVariantCookies} from "zum-portal-core/backend/util/ABTestUtils";
import {Request, Response, NextFunction} from "express";

@Component()
export default class ABTestMiddleware {

  public setup(req: Request, res: Response, next: NextFunction) {
      putVariantCookies(req, res, {
        // A, B, C, D 테스트에 대한 가중치 부여
        example: {
          A: 0.1,
          B: 0.2,
          C: 0.3,
          D: 0.4,
        }
      });
      next();
  }

}

/** 2. Controller에 Middleware 연결 **/
import {Controller, GetMapping} from "zum-portal-core/backend/decorator/Controller";
import {Request, Response} from "express";
import {Middleware} from "zum-portal-core/backend/decorator/Middleware";
import {Inject} from "zum-portal-core/backend/decorator/Alias";

// 앞에서 선언한 미들웨어
import ABTestMiddleware from "./middleware/TestInjectableMiddleware";

@Controller({path: '/'})
export class ABTestController {
  
  // 의존성 주입
  constructor(
    @Inject(ABTestMiddleware) private abTestMiddleware: ABTestMiddleware
  ) {}
  
  /** API를 통해서 ABTest Variant를 설정하는 경우 **/
  // Middleware를 통해 ABTest Variant 설정(쿠키에 값 할당) 
  @Middleware(() => this.ABTestMiddleware.setup)
  @GetMapping({path: '/api/abtest'})
  public abtest(req: Request, res: Response) {
    // 결과값은 임의로 반환.
    res.json({
      cookies: res.getHeader('set-cookie')
    });
  }
  
  /** SSR과 동시에 ABTest Variant를 설정하는 경우 **/
  @Middleware(() => this.ABTestMiddleware.setup)
  @GetMapping({path: '/**'})
  public async getHome(req: Request, res: Response) {
    res.send(await this.homeFacade.getRenderedHtml());
  }

}
```
  
#### 2) Frontend

```vue
<template>
  <div id="app">
    <!--
    - ABTest Component를 import하여 사용해야 함
    - @params `variants`: abtest에서 사용될 variants
    - @params `selectedVariant`: 선택된 variant
    -->
    <ABTest :variants="variants" :selectedVariant="selectedVariant">
      <!-- slot의 값과 selectedVariant가 동일한 경우에 렌더링 됨 -->
      <div :slot="variants[0]">A 렌더링</div>
      <div :slot="variants[1]">B 렌더링</div>
      <div :slot="variants[2]">C 렌더링</div>
      <div :slot="variants[3]">D 렌더링</div>
    </ABTest>
  </div>
</template>

<script>
import ABTest from "zum-portal-core/frontend/components/ABTest";

// 쿠키에서 ABTest의 Variant를 가져오는 함수
const getABTestVariant = (key) => {
  const variants = Cookies.getJSON('_ABTEST_VARIANT') || {};
  return variants[key] || null;
}
      
export default {
  name: 'App',

  components: {ABTest},

  data: () => ({
    selectedVariant: 'A', // 초기 Variant는 A를 사용한다.
    variants: ['A', 'B', 'C', 'D'],
  }),

  // SSR 때문에 mounted 시점에 variant를 교체해야 됨.
  mounted () {
    const selectedVariant = getABTestVariant('example');
    if (selectedVariant === null) {
      // API로 variant를 설정할 경우에는 다음과 같이 호출이 필요함
      Axios.get('/api/abtest').then(() => {
        this.selectedVariant = getABTestVariant('example') || 'A';
      });
    } else {
      this.selectedVariant = selectedVariant;
    }
  }
}
</script>
```
