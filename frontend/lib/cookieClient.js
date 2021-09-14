const Cookies = require('js-cookie');

const NUMBER_REGEXP = /^\d+$/;

const cookieClient = {
  get(key) {
    const value = Cookies.get(key);
    // Number 파싱
    if (NUMBER_REGEXP.test(value)) {
      return parseInt(value);
    }
    return value;
  },
  set(key, value, options = {}) {
    // 개발중일때 domain option 제거
    if(process.env.NODE_ENV !== 'production') {
      if(options.domain) delete options.domain;
    }

    return Cookies.set(key, value, {
      ...options,
      expires: options.expires || 30
    });
  },
};

module.exports = { cookieClient };
