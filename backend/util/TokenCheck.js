"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegisteredToken = void 0;
const tsyringe_1 = require("tsyringe");
/**
 * tsyringe 컨테이너에 등록된 토큰인지 체크하는 함수
 *
 * @param token 유효성을 체크할 토큰
 */
function isRegisteredToken(token) {
    try {
        tsyringe_1.container.resolve(token);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isRegisteredToken = isRegisteredToken;
//# sourceMappingURL=TokenCheck.js.map