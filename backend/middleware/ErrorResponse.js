"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
/**
 * 특정 URL 접속시 에러를 반환하는 메소드
 * @param req
 * @param res
 * @param next
 */
function default_1(req, res, next) {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { type, message } = req.params;
    const logMessage = `Client ip: ${clientIp}\nLevel: ${type}\nMessage: ${message}`;
    if (type === 'info') {
        util_1.logger.info(logMessage);
    }
    else if (type === 'warn') {
        util_1.logger.warn(logMessage);
    }
    else {
        util_1.logger.error(logMessage);
    }
    res.send(logMessage);
}
exports.default = default_1;
//# sourceMappingURL=ErrorResponse.js.map