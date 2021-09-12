/*
 **********************************************************
 *
 *                Axios Monkey patch 로직
 *
 *          퍼블리시 모드로 기동시 모든 데이터를
 *           stub 폴더에서 가져오도록 구성한다
 *
 * process.env.NODE_ENV 체크 구문이 있어야 번들링시 코드가 제거된다
 *
 **********************************************************
 */
if (process.env.NODE_ENV !== 'production' && process.env.ZUM_FRONT_MODE === 'publish') {
  var regex = /^.*\/\/[^\/]+:?[0-9]?\//i;
  var methods = ['request', 'get', 'delete', 'head', 'options', 'post', 'put', 'patch'];
  var _$methods = [];

  for (var _i = 0, _methods = methods; _i < _methods.length; _i++) {
    var method = _methods[_i];

    /**
     * axios 몽키패칭
     *
     * @param url 기본 URL
     * @param args 그 외 옵션
     */
    _$methods[method] = Axios[method];

    (function (method) {
      Axios[method] = function (url) {
        var m = _$methods[method];

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (url.indexOf('http') !== -1) {
          // 외부 호출인 경우 패칭하지 않음
          return m.apply(void 0, [url].concat(args));
        }

        ; // URL 패칭 이후 js 파일 로드

        var paredUrl = url.replace(regex, '');

        if (paredUrl.charAt(0) !== '/') {
          paredUrl = '/' + paredUrl;
        }

        ;
        return m.apply(void 0, [process.env.publicPath + 'stub' + paredUrl].concat(args));
      };
    })(method);

  }

  ;
}
