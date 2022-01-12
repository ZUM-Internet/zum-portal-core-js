# CHANGELOG

## 1.1.6
- fix: Axios.request에 method 추가 [45f26d6](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/45f26d60f4974b91cb3f7fce7ee87c427c793013) junil
- fix: changelog 수정 [1f531cf](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/1f531cf0ff2ecbc15a678338bf90dd3fa8d70f8d) junil

## 1.1.5
- fix: adapter에서 axios.request 사용하도록 작업 완료 [23f4378](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/23f437872a8f67c91c41849492c69e2465719ebf) junil

## 1.1.4
- feat: nest application options 를 주입할 수 있도록 작업 완료 [a1882af](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/a1882afa54135437393cf6a88e5bff34a8d5dad1) junil

## 1.1.3
- fix: whatap 에이전트 등록 구문 import -> require로 변경 [b7f06cb](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/b7f06cbeec4585db67cbf8693991077ddd2b59bb) dogyeong

## 1.1.2
- fix: whatap 등록 로직을 node 앱 초기화 이전으로 이동 [7e5900a](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/7e5900a94da1abd8d6fec86e9b18092cd8d6d1eb) dogyeong
- chore: auto-publish 스크립트 적용 [f11e3a7](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/f11e3a77e17832972b08997a4b2608a1c1af91c2) dogyeong

## 1.1.1
- fix: Yml 경로 설정 시점 변경 [402b747](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/402b747e3f2ec86cf7f539a35f78439ade09632c) dogyeong

## 1.1.0
- feat: 도커 이미지 태그파일 찾는 로직 개선 [a273603](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/a27360382483350cceaef6449add03e4021dd009) dogyeong
- feat: 정적파일 max-age 헤더 설정 변경 [2027a1b](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/2027a1b49075f20703c5d94cdc105b297de2a8fb) dogyeong
- fix: 오타 수정 [6ac5523](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/6ac552307f378c6c0190ef3f7bf0226842eb3b39) dogyeong
- refactor: abTestUtils 리팩토링 [7f0a9ff](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/7f0a9ff50195908538de2182e982dfbd429d98d8) dogyeong
- chroe: AB테스트 유틸 테스트 추가 [8d3f53f](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/8d3f53f28bb408dbb2f5d608278534118eb9bff1) dogyeong
- refactor: abTestUtils 리팩토링 [6003e36](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/6003e361d7d6df4ce0fc308d630b0a33ece6d3bf) dogyeong
- chore: 파일이름 소문자로 시작하도록 수정 [cef8cf1](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/cef8cf101fc7bdabb9136e204875e541ca3516bb) dogyeong
- chore: logger 테스트 추가 [992716b](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/992716b387437738c04e4482bc11f2f6953e5996) dogyeong
- chore: 테스트 코드 수정 [08773a1](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/08773a18cbd27804eb4f9b233a05e01fd5b4f869) dogyeong
- chore: SSR 테스트 추가 [0145a0d](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/0145a0d0cf851b0bd0ca651d6719fb30df735a99) dogyeong
- refactor: bundleRendering 파라미터 optional로 변경 [f464cb9](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/f464cb903fc870822e47da1936fa1ff773e4a1c2) dogyeong
- chore: gitignore 수정 [71d93cb](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/71d93cb40192973aea4b796171cf13e9cd2a4148) dogyeong
- chore: cookieJar 테스트 추가 [5fb183f](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/5fb183f5c78972e435c14c5f17c3d915cd7c1945) dogyeong
- fix: 쿠키 여러개 설정 안되던 이슈 수정 [b9dd42c](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/b9dd42c31464eb1ae5ed91a00fe9bc48b94bd242) dogyeong
- fix: cookieJar export 추가 [77b6a14](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/77b6a144a291f7c5218ef0c627a759eb32dfaf7b) dogyeong
- fix: nest 빌드 시 테스트 파일은 빌드되지 않도록 수정 [e550d16](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/e550d1673968eadf24cd6174f4a4c25131a21031) dogyeong
- refactor: BundleRendering 리팩토링, cookieJar 파일 분리 [dc5b324](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/dc5b32461213bf887b9a2ece37477661950cbd6d) dogyeong
- fix: 스태틱 파일 캐싱 기간 변경 [3e04367](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/3e043676ef125946351e71a24882add857855023) dogyeong
- refactor: errorResponse 미들웨어 제거 [e5a2277](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/e5a22774e85bfa35ba579f733909951b49dda507) dogyeong
- refactor: coTracker 미들웨어 제거 [81da205](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/81da205766ecce5e76afbd4bbbe0b92682cdba3a) dogyeong
- refactor: CronJob에 runOnInit 옵션 추가 [001d0d8](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/001d0d84c1a04863cab9a4f32bcbf2bcbf456270) dogyeong
- refactor: createApplication 헬퍼함수 추출 [2b1df7c](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/2b1df7c2a58389084df4ccdc566f5768acb1f45c) dogyeong
- chore: zum-cache 테스트 코드 추가 [fda3773](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/fda3773eeb5a28aecc3e156d2828b7bb0e71ed4a) dogyeong
- refactor: provider 테스트 코드에서 mock-api 파일 분리 [5b8cc70](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/5b8cc7084e04536126b915d67f7833d48bc7e013) dogyeong
- chore: jest 옵션 추가 [11171a8](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/11171a8335af0e5f7be5c347c568d540f5b9acfe) dogyeong
- refactor: zum-cache 모듈 리팩토링 [aeada0b](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/aeada0bdd731d6c452a51b9e7925eaadca10f8ed) dogyeong
- chore: prettier 설치 [ef4301d](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/ef4301d0474b240f9d663a6a65349dbd836bb8cf) dogyeong
- chore: 의존성에 cron 추가 [7fe1ac0](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/7fe1ac04b87f5355af0496457800a6c42a897ccc) dogyeong
- chore: jest 환경설정, ZumProvisionAdapter 테스트코드 추가 [c4d626a](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/c4d626ad32e29e5626bd365e1fe055371f36d496) dogyeong
- chore: @nestjs/testing 패키지 devDependencies로 이동 [da65d31](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/da65d317c7b1f8b12c5ecd1d8e7ce71bf7dd1df8) dogyeong
- refactor: base.app.container 리팩토링 [86ac709](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/86ac70956f7baedd641fa8c290e886cc3bf825f7) dogyeong
- Refactor: 버전응답 미들웨어 추가 및 이름 변경 [e34f4f8](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/e34f4f8e1a297272c13c9b2fd34c04e30b0cfddb) dogyeong
- chore: eslint, prettier 적용, 코드 포맷팅, 필요한 의존성 설치 [fa82a81](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/fa82a81d021b8700b2eeafb421a984ab74c1870b) dogyeong
- refactor: Cache Module 리팩토링 [bb6cbdc](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/bb6cbdcdedbdb037ac68c49a133841c231cc4f00) junil
- fix: 이상한 import 제거 [f29f4fd](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/f29f4fd5997a6d17f5b748b2e5472293a3cf159e) junil
- feat: ZumCacheModule 추가 [2698b50](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/2698b50b1d9df61688953436ba91bdd03b7628dc) junil
- refactor: setup option 수정 [50d9599](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/50d9599e7fe1e81cf75bc732101f07e39b53e57a) dogyeong
- feat: setup 할 때 resource path 주입하도록 작업 완료 [a1531ca](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/a1531ca8ad5c408bc15de0c6de4869a892f33a51) junilhwang
- feat: error log 추가 [18ce7ab](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/18ce7abed1366df55acda60479eca981771e012c) junilhwang
- fix: post method의 5mb 용량 제한 추가 [d8beb76](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/d8beb7636865b3122c6abfad1dc658c27a88a232) junilhwang

## 1.0.0
- fix: 예제 코드 작성 완료 [49fe23b](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/49fe23bdf287b5ef8acb034445b00d97b286a999) junilhwang
- fix: 불필요한 로그 제거 [63822b9](https://git.zuminternet.com/zum-portal-framework/zum-portal-core-js-project/commit/63822b9ae412c3fb5f7fb9fcdad9cc008ade096d) junilhwang