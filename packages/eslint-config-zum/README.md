# eslint-config-zum

> 코딩 컨벤션 지원을 위한 eslint 룰셋입니다
> [원본 notion 문서](https://www.notion.so/zuminternet/eslint-config-zum-eea07212e4234799977949b9cff07461)

## 프로젝트에 적용 방법

### 1. 패키지 설치

```bash
# 호환되는 peerDependencies 설치를 위해 install-peerdeps 패키지를 사용합니다
# 자동으로 eslint, typescript를 같이 설치해줍니다

npx install-peerdeps -D @zum-portal-core/eslint-config-zum
```

### 2. eslint 설정 파일 생성

`.eslintrc.js`를 생성하고 언어에 따라 다르게 설정해줍니다

```js
// TypeScript
module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname, // 모노레포에서 tsconfig파일을 못 찾는 경우 tsconfigRootDir 지정
  },
  extends: ['@zum-portal-core/eslint-config-zum'],
};
```

```js
// Vue
module.exports = {
  extends: ['@zum-portal-core/eslint-config-zum/vue'],
};
```

### 3. env 적용(옵션)

런타임 환경을 지정해줍니다

[https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments](https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments)

```diff
// .eslintrc.js
module.exports = {
+ env: {
+   node: true,     // Node.js 글로벌 변수 추가
+   browser: true,  // 브라우저 글로벌 변수 추가
+   commonjs: true, // 웹팩 코드의 경우
+ },
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['@zum-portal-core/eslint-config-zum'],
};
```

### 4. prettier 적용(옵션)

prettier와 같이 사용하는 경우 추가 설정이 필요합니다.

4-1. 패키지 설치

```bash
npm i -D prettier eslint-config-prettier eslint-plugin-prettier
```

4-2. prettier 설정파일 생성 (예시)

```json
// .prettierrc
{
  "parser": "typescript",
  "singleQuote": true,
  "printWidth": 110,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "quoteProps": "as-needed",
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "auto",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "requirePragma": false,
  "insertPragma": false,
  "proseWrap": "preserve"
}
```

4-3. eslint설정의 extends옵션 마지막에 `plugin:prettier/recommended` 추가

```diff
// .eslintrc.js
module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
- extends: ['@zum-portal-core/eslint-config-zum'],
+ extends: [
+   '@zum-portal-core/eslint-config-zum',
+   'plugin:prettier/recommended'
+ ],
};
```

## 트러블 슈팅

- eslint 설정파일에서 `The file must be included in at least one of the projects provided.` 에러가 발생하는 경우
  - tsconfig에서 eslint파일을 포함하지 않아서 발생하는 문제. 일반적으로는 eslint용으로 따로 tsconfig파일을 하나 더 추가해준다. [(관련링크)](https://github.com/iamturns/eslint-config-airbnb-typescript#i-get-this-error-when-running-eslint-the-file-must-be-included-in-at-least-one-of-the-projects-provided)
