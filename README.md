Express-Core Project
===
## Node.js Express 기반, Typescript를 적용하고 편의를 위한 데코레이터를 추가 개발
1. MS의 (tsyring)[https://github.com/microsoft/tsyringe] 컨테이너를 이용하여 싱글톤 기반으로 구현한다.
1. (node-schedule)[https://github.com/node-schedule/node-schedule], (node-cache)[https://github.com/node-cache/node-cache] 등의 라이브러리를 이용하여
포털 개발팀에서 자주 사용되는 패턴을 간단하게 사용하는 것을 목표로 한다.

### 기본 설정
#### 백엔드  
1. resources/application.yml  
  - publicPath: 백엔드 라우터의 기본 URL을 지정
  
#### 프론트엔드
1. vue.config.js
**modeConfigurer**: 프론트엔드의 dev/publish 모드 등 기본 설정을 적용하는 함수
  - publicPath: 프론트엔드 Vue.js 라우터의 기본 URL을 지정

### 유틸성 객체 및 함수
1. Logger : winston logger를 이용하여 로그를 남길때 사용한다.
2. ResourceLoader : /resources 디렉토리 내의 파일을 가져올 때 사용한다.

### 데코레이터 목록
1. @Controller : Request Mapping을 위해 사용하는 컨트롤러 클래스에 사용한다.
    1. @[Get, Post, Put, Delete]Mapping : 데코레이팅한 메소드를 http 요청에 핸들링한다.
1. @Component : 기능을 담당하는 클래스임을 표기한다. 설정시 singleton 객체로 등록된다.
    1. @Caching : 해당 메소드의 반환값을 캐시한다.
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
