import cookie from "js-cookie";

const ABTEST_COOKIE_NAME = '_ABTEST_VARIANT';

export default Object.freeze({

  get(key) {
    const variants = cookie.getJSON(ABTEST_COOKIE_NAME) || {};
    return variants[key] || null;
  }

});
