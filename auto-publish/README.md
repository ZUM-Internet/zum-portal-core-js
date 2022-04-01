# auto-publish

> npm 패키지 자동 배포를 위한 도구

## 기능

1. package.json의 버전 수정
1. 커밋 로그를 기반으로 `CHANGELOG.md` 파일 생성
1. `npm publish` 수행
1. 배포 커밋 생성
1. 배포 태그 생성 및 push

## 사용법

```bash
node lib/index.js <command>
                  [-c=<prefix> | --commit-prefix=<prefix>]
                  [-t=<prefix> | --tag-prefix=<prefix>]
```

### 옵션 설명

`command`(필수)

- 올릴 버전의 단계
- `major`, `minor`, `patch` 중 하나

`commit-prefix`(옵션)

- CAHNGELOG를 생성하는데 사용
- 커밋 로그 중 `[commit-prefix]`가 포함된 커밋만 CHANGELOG에 추가하도록 한다
- 생략하면 package.json의 `name` 필드가 기본값으로 사용된다

`tag-prefix`(옵션)

- 태그를 생성하는데 사용
- 생략하면 `commit-prefix` 옵션이 기본값으로 사용된다

## 주의점

배포하기 전 체크해야 할 점

1. `auto-publish`의 의존성이 설치되었는지 체크
1. npm 계정이 제대로 설정되었는지 체크
