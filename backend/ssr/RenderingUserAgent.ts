/**
 * SSR 시 사용할 유저 에이전트.
 *
 * SSR 렌더링된 HTML과 프론트엔드에서 생성한 가상돔 불일치 가능성이 높아
 * 사용을 권장하지 않음
 */
export const renderingUserAgent = {
  desktop: {
    windowChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
  },

  mobile: {
    android: "Mozilla/5.0 (Linux; Android 9; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.83 Mobile Safari/537.36 SSR_RENDERER",
    ios: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 SSR_RENDERER"
  },
};

export const iosValidator: (string) => boolean = (userAgent) => /iphone|ipad|ipod|ios/gi.test(userAgent);
