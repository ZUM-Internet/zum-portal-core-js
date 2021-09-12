/*
 **********************************************************
 *
 *            js-cookie Monkey patch 로직
 *
 * Cookies.set 기본 expires 설정,
 * Cookies.get number 타입일 시 리턴 값 number로 설정
 *
 **********************************************************
 */
var isNumber = /^\d+$/;

/**
 * JS 쿠키 set 메소드
 * @param key 쿠키 키 값
 * @param value 쿠키 키에 저장할 값
 * @param options 쿠키 저장 옵션
 * @returns {*}
 */
var _cookieSet = Cookies.set;
Cookies.set = function set(key, value, options) {

  // 쿠키 기본 옵션 설정
  options = options ? options : {};

  if (!options.expires) {
    options.expires = 30;
  }

  // 개발중일때 domain option 제거
  if(process.env.NODE_ENV !== 'production') {
    if(options.domain) delete options.domain;
  }

  return _cookieSet(key, value, options);
};



/**
 * JS 쿠키 get 메소드
 * @param key 가져올 키
 * @param options 가져오기 위한 옵션
 */
var _cookieGet = Cookies.get;
Cookies.get = function get(key, options) {
  var value = _cookieGet(key, options);

  // Number 파싱
  if (isNumber.test(value)) { return parseInt(value); }

  return value;
};
