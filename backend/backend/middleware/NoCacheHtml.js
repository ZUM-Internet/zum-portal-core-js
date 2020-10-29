"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HTML 캐시를 하지 않게 하기 위해 헤더를 추가하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
function default_1(req, res, next) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
}
exports.default = default_1;
//# sourceMappingURL=NoCacheHtml.js.map