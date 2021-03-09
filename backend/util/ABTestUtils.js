"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putVariantCookies = void 0;
const ABTEST_COOKIE_NAME = '_ABTEST_VARIANT';
/**
 * AB테스트 대상값인 variant에 따라 테스트명별로 쿠키를 생성한다.
 *
 * @param req 미들웨어 요청
 * @param res 미들웨어 응답
 * @param variant {테스트명: {키: 생성 비율(0.x ~ 1)}} 형태의 값
 *        ex) {example1: { a: 0.1, b: 0.9 }}
 *        ex) {example2: { a: 0.1, b: 0.2, c: 0.3, d: 0.4` }}
 * @param cookieOptions 쿠키 설정 옵션
 */
function putVariantCookies(req, res, variant, cookieOptions = {}) {
    const cookieValue = JSON.parse(req.cookies[ABTEST_COOKIE_NAME] || null) || {};
    // 테스트별로 쿠키 값 객체에 랜덤 생성하여 추가
    for (const [testName, variantValues] of Object.entries(variant)) {
        // 이미 쿠키에 선언되어 있는 경우 제외
        if (cookieValue === null || cookieValue === void 0 ? void 0 : cookieValue[testName]) {
            continue;
        }
        // 랜덤하게 Variant 타깃 생성
        const total = Object.values(variantValues).reduce((acc, cur) => acc + cur, 0);
        const seed = Math.random() * total;
        let targetKey = Object.keys(variantValues)[0];
        let fixValue = 0;
        for (const [key, value] of Object.entries(variantValues)) {
            if (seed <= fixValue + value) {
                targetKey = key;
                break;
            }
            fixValue += value;
        }
        cookieValue[testName] = targetKey;
    }
    // 쿠키 설정
    res.cookie(ABTEST_COOKIE_NAME, JSON.stringify(cookieValue), Object.assign({}, cookieOptions));
}
exports.putVariantCookies = putVariantCookies;
//# sourceMappingURL=ABTestUtils.js.map