"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoTracker = void 0;
// 쿠키 기본 옵션
const COOKIE_OPTION = {
    domain: 'zum.com',
    maxAge: 60 * 60 * 24 * 3650,
    path: '/'
};
// cocode, couid validate 함수
const validate = (cocode, couid) => couid && cocode && cocode.length >= 4;
/**
 * 동원 책임님이 만드신 CoTracker 노드 버전.
 * 사용자 추적을 위해 사용된다.
 *
 * @link {https://git.zuminternet.com/zum-portal-framework/zum-portal-cotracker}
 * @param req
 * @param res
 * @param next
 */
function CoTracker(req, res, next) {
    // cocode 획득
    let { cocode, couid } = req.headers;
    if (!validate(cocode, couid)) {
        ({ cocode, couid } = req.query);
    }
    // cocode, couid가 정상적이지 않은 경우 실행하지 않는다.
    if (!validate(cocode, couid)) {
        return next();
    }
    // cocode, couid를 이용하여 쿠키 생성
    res.cookie(`_COUID`, `${cocode}|${couid}`, COOKIE_OPTION);
    return next();
}
exports.CoTracker = CoTracker;
//# sourceMappingURL=CoTracker.js.map