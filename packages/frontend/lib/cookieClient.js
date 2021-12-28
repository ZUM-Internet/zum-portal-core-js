import Cookies from 'js-cookie';

/**
 * 배포하기 전에 빌드하지 않기 때문에 IE호환되는 문법으로 작성
 */

var NUMBER_REGEXP = /^\d+$/;

export var cookieClient = {
  get: function (key) {
    var value = Cookies.get(key);
    // Number 파싱
    if (NUMBER_REGEXP.test(value)) {
      return parseInt(value);
    }
    return value;
  },
  set: function (key, value, options) {
    if (!options) options = {};

    // 개발중일때 domain option 제거
    if (process.env.NODE_ENV !== 'production' && options.domain) {
      delete options.domain;
    }

    options.expires = options.expires || 30;

    return Cookies.set(key, value, options);
  },
  remove: function (key, options) {
    Cookies.remove(key, options);
  },
};
