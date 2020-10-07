Express-Core Project
===
## Node.js Express 기반, Typescript를 적용하고 편의를 위한 데코레이터를 추가 개발
1. MS의 (tsyring)[https://github.com/microsoft/tsyringe] 컨테이너를 이용하여 싱글톤 기반으로 구현한다.
1. (node-schedule)[https://github.com/node-schedule/node-schedule], (node-cache)[https://github.com/node-cache/node-cache] 등의 라이브러리를 이용하여
포털 개발팀에서 자주 사용되는 패턴을 간단하게 사용하는 것을 목표로 한다.
===
### 변경 내역
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

===
### 접근방법
1. 줌인터넷 넥서스 로그인
  npm login --registry=http://ci-portal.zuminternet.com/nexus/repository/zum-portal-core-js/  
  ID: zum-portal-dev PW: 비밀번호 (팀문서확인)
1. typescript 컴파일 
  npm run build 명령어로 컴파일
2. 배포
  npm publish

### 기본 설정
1. global.ZUM_OPTION
    프론트엔드 줌 코어 옵션
    - frontSrcPath
        프론트엔드 소스 폴더 위치. 기본값 process.env.INIT_CWD/frontend
    - resourcePath
        프론트엔드 리소스 폴더 위치. 기본값 process.env.INIT_CWD/frontend/resources 
    - outputPath
        프론트엔드 번들링 결과 폴더 위치. 기본값 process.env.INIT_CWD/frontend/resources
    - stubPath
        프론트엔드 publish 모드에서 stub 데이터 위치. 기본값 resourcePath/stub
1. process.env.ZUM_FRONT_MODE
    프론트엔드 기동 모드. [dev/publish/ssr/undefined] undefined의 경우 빌드시에만 사용할 것

#### 백엔드  
1. resources/application.yml  
  - publicPath: 백엔드 라우터의 기본 URL을 지정
  
#### 프론트엔드
1. vue.config.js
**modeConfigurer**: 프론트엔드의 dev/publish 모드 등 기본 설정을 적용하는 함수
  - publicPath: 프론트엔드 Vue.js 라우터의 기본 URL을 지정
  
0. path shortcut
  - @ : process.env.FRONTEND_PATH/assets
  - \# : process.env.RESOUCES_PATH

### 유틸성 객체 및 함수
1. Logger : winston logger를 이용하여 로그를 남길때 사용한다.
2. ResourceLoader / ResourcePath : /resources 디렉토리 내의 파일을 가져올 때 사용한다.

### 데코레이터 목록
1. @Controller : Request Mapping을 위해 사용하는 컨트롤러 클래스에 사용한다.
    1. @[Get, Post, Put, Delete]Mapping : 데코레이팅한 메소드를 http 요청에 핸들링한다.
    1. @Middleware: 핸들러에 미들웨어를 삽입한다.
1. @Component : 기능을 담당하는 클래스임을 표기한다. 설정시 singleton 객체로 등록된다.
    1. @PostConstructor: 생성자 실행 이후 실행되는 메소드. 생성자에서 불가능한 async 작업 등을 수행한다.
    1. @Caching : 해당 메소드의 반환값을 캐시한다. 결과값은 deepFreeze 상태로 변경이 불가능하다.
    1. @Scheduled : 해당 메소드를 일정 시간마다 실행한다.
    1. @Inject : Component의 constructor에서 사용 가능한 데코레이터로 파라미터에 해당하는 객체를 주입받는다.
    1. @Yml : Component의 constructor에서 사용 가능한 데코레이터로 파일명에 해당하는 yml 객체를 주입받는다.
    
1. @Component의 Alias : @Component는 아래와 같은 이름으로도 사용할 수 있다.
    1. @Service
    1. @Scheduler
    1. @Singleton
    1. @Injectable
    1. @Facade

### SSR시 사용 가능한 객체 및 함수
1. bundleRendering: Vue Server Renderer 객체를 받아 JSDOM을 활용, 렌더링하고 결과를 반환하는 함수
1. createCookieJar: JSDOM에 적용할 수 있는 CookieJar 생성 함수
1. renderingUserAgent: JSDOM에 적용할 브라우저별 user agent

### 사용 방법
#### 코어 적용 및 서버 구동
1. 백엔드 프로젝트에서 Express.js 어플리케이션 컨테이너인 AppContainer 클래스에 BaseAppContainer 추상 클래스를 상속받는다.
1. 백엔드 프로젝트 시작을 위해 작성하는 Server.ts 파일에서 AppContainer를 import 할 수 있도록 AppContainer에 export 구문을 작성한다
```typescript
export const appContainer = container.resolve(AppContainer);
```
이 구문은 tsyring 컨테이너에 추가된 AppContainer 객체를 export하는 구문으로, Server.ts에서는 해당 객체를 이용하여 서버측 어플리케이션을 실행할 수 있다.

#### 아키텍처 설계
1. 아키텍처는 도메인 서비스에 맞게 자유롭게 작성한다.
1. 필요에 따라 본 코어 프로젝트에서 사용하는 @Component 계열 데코레이터를 사용하지 않고 Express.js 기본 문법으로 작성해도 무관하다.
1. 하지만 기본적인 웹 서비스 패턴을 따르고 유지보수성을 증대하기 위해 코어 프로젝트에서 사용하는 데코레이터를 사용하는것을 권장한다. 

#### EJS 템플릿 엔진
1. 대부분의 데이터는 프론트엔드에서 처리하지만 SSR 후 HTML 태그 삽입이나 데이터 전달을 위해 사용한다.
1. <% %> 형태의 기본 문법 사용시 웹팩 플러그인과 충돌하여 <? ?> 태그로 변경 처리되어 있다.
![change delimieter](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/raw/master/change_delimeter.png)
InteliJ의 EJS 플러그인에 위 옵션을 적용하여 템플릿 문법을 사용할 수 있다.
