import Cookies from 'js-cookie';

const NUMBER_REGEXP = /^\d+$/;

export const cookieClient = {
  get(key: string) {
    const value = Cookies.get(key);

    // Number 파싱
    if (value && NUMBER_REGEXP.test(value)) {
      return parseInt(value);
    }

    return value;
  },
  set(key: string, value: string, options: Cookies.CookieAttributes = {}) {
    // 개발중일때 domain option 제거
    if (process.env.NODE_ENV !== 'production' && options.domain) {
      delete options.domain;
    }

    options.expires = options.expires || 30;

    return Cookies.set(key, value, options);
  },
  remove(key: string, options?: Cookies.CookieAttributes) {
    Cookies.remove(key, options);
  },
} as const;
