module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    /**
     * 
     *  Eslint Rules for Vue2
     *  @see https://eslint.vuejs.org/rules/
     * 
     * /

    /**
     *
     * ESSENTIAL
     *
     */

    // 컴포넌트 이름으로 2단어 이상 사용해야 한다
    'vue/multi-word-component-names': 'error',

    // data 프로퍼티에서 computed 프로퍼티를 사용할 수 없다
    'vue/no-computed-properties-in-data': 'error',

    // nextTick에 콜백함수를 전달하거나 await 또는 then을 사용해야 한다
    'vue/valid-next-tick': 'error',

    /**
     *
     * STRONGLY RECOMMENDED
     *
     */

    // 속성은 hyphenation 방식으로 표기해야 한다
    'vue/attribute-hyphenation': ['error', 'always'],

    // html 태그의 닫는 괄호는 한 줄일 때는 붙이고, 여러줄일 때는 다음 줄에 써야 한다
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],

    // 모든 태그는 내용이 없을 때 self-closing 형태로 사용해야 한다
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],

    // html 태그 괄호에 대한 룰
    // < 괄호 뒤에 공백이 없어야 한다
    // > 괄호 앞에 공백이 없어야 한다
    // /> 괄호 앞에 공백이 있어야 한다
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
      },
    ],

    // 태그 속성값에는 double quote를 사용해야 한다
    // 속성값에 double quote가 들어가는 경우 single quote 사용 가능하다
    'vue/html-quotes': ['error', 'double', { avoidEscape: true }],

    // 한 줄에 속성 하나만 명시해야 한다
    'vue/max-attributes-per-line': [
      'error',
      {
        // prettier와 충돌이 발생하기 때문에 싱글라인인 경우에는 제한을 제거한다
        singleline: { max: 30 },
        multiline: { max: 1 },
      },
    ],

    // mustache 템플릿 값과 괄호 사이에 공백이 있어야 한다
    // ex) {{ text }}
    'vue/mustache-interpolation-spacing': ['error', 'always'],

    // 2개 이상의 연속된 공백이 있으면 안된다
    'vue/no-multi-spaces': ['error', { ignoreProperties: false }],

    // 속성값의 equal 기호 옆에 공백이 있으면 안된다
    // ex) <div class = "active"></div> --> BAD
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',

    // 템플릿 상위 스코프의 변수를 내부 스코프에서 다시 정의하면 안된다
    'vue/no-template-shadow': 'error',

    // 하나의 파일에는 하나의 컴포넌트만 정의되어야 한다
    'vue/one-component-per-file': 'error',

    // props 이름은 카멜 케이스로 해야 한다
    'vue/prop-name-casing': ['error', 'camelCase'],

    // required: true가 아닌 props에 default값을 필수적으로 명시해야 한다
    'vue/require-default-prop': 'error',

    // props에 타입을 명시해야 한다
    'vue/require-prop-types': 'error',

    // v-bind 디렉티브는 항상 축약형으로 사용해야 한다
    // ex) <div :foo="bar" />
    'vue/v-bind-style': ['error', 'shorthand'],

    // v-on 디렉티브는 항상 축약형으로 사용해야 한다
    // ex) <div @click="foo" />
    'vue/v-on-style': ['error', 'shorthand'],

    // v-slot 디렉티브는 항상 축약형으로 사용해야 한다
    // 커스텀 컴포넌트에 직접 default 슬롯을 지정할 때는 v-slot을 사용한다
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'v-slot',
        default: 'shorthand',
        named: 'shorthand',
      },
    ],

    /**
     *
     * RECOMMENDED
     *
     */

    // 컴포넌트 태그는 template, script, style 순서로 배치되어야 한다
    'vue/component-tags-order': ['error', { order: ['template', 'script', 'style'] }],

    // 디렉티브가 없는 template태그는 의미가 없으므로 사용하면 안된다
    'vue/no-lone-template': 'error',

    // scopedSlot에 2개 이상의 파라미터를 넘기면 안된다
    'vue/no-multiple-slot-args': 'error',

    // 템플릿 내에서 this를 사용하면 안된다
    'vue/this-in-template': ['error', 'never'],

    /**
     *
     * ETC
     *
     */

    // script 태그는 lang="ts" 속성을 필수로 가져야 한다
    'vue/block-lang': ['error', { script: { lang: 'ts' } }],

    // 템플릿에서 컴포넌트는 파스칼 케이스로 사용해야 한다
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],

    // 커스텀 이벤트 이름은 카멜 케이스로 사용해야 한다
    'vue/custom-event-name-casing': ['error', 'camelCase'],

    // 2줄 이상의 프로퍼티 다음에는 한 줄 비워야 한다
    'vue/new-line-between-multi-line-property': ['error', { minLineOfMultilineProperty: 2 }],

    // 컴포넌트 이름은 파일 이름과 일치해야 한다
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['jsx', 'vue'],
        shouldMatchCase: true,
      },
    ],

    // 미리 정의된 태그, 컴포넌트 이름을 커스텀 컴포넌트 이름으로 사용할 수 없다
    'vue/no-reserved-component-names': [
      'error',
      {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      },
    ],

    // 등록되지 않은 컴포넌트를 템플릿 내에서 사용할 수 없다
    'vue/no-unregistered-components': ['error', { ignorePatterns: [] }],

    // 사용되지 않는 프로퍼티가 있으면 안된다
    'vue/no-unused-properties': [
      'error',
      {
        groups: ['props', 'data', 'computed', 'methods', 'setup'],
        deepData: true,
        ignorePublicMembers: false,
      },
    ],

    // 사용되지 않는 ref가 있으면 안된다
    'vue/no-unused-refs': 'error',

    // mustache 템플릿 값으로 문자열 리터럴을 넣으면 안된다
    'vue/no-useless-mustaches': [
      'error',
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],

    // v-bind 디렉티브 값으로 문자열 리터럴을 넣으면 안된다
    'vue/no-useless-v-bind': [
      'error',
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],

    // template, script, style 블록 사이에 공백이 있어야 한다
    'vue/padding-line-between-blocks': ['error', 'always'],

    // 컴포넌트에 name 프로퍼티가 필수로 있어야 한다
    'vue/require-name-property': 'error',

    // 불필요한 eslint-disable-* 주석을 사용하지 않는다
    'vue/comment-directive': [
      'error',
      {
        reportUnusedDisableDirectives: true,
      },
    ],
  },
};
