/**
 * SSR 시 사용할 유저 에이전트.
 *
 * SSR 렌더링된 HTML과 프론트엔드에서 생성한 가상돔 불일치 가능성이 높아
 * 사용을 권장하지 않음
 */
export declare const renderingUserAgent: {
    desktop: {
        windowChrome: string;
    };
    mobile: {
        android: string;
        ios: string;
    };
};
export declare const iosValidator: (string: any) => boolean;
