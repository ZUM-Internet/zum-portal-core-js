"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../util/Logger");
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
        Logger_1.default.info(logMessage);
    }
    else if (type === 'warn') {
        Logger_1.default.warn(logMessage);
    }
    else {
        Logger_1.default.error(logMessage);
    }
    res.send(logMessage);
}
exports.default = default_1;
//# sourceMappingURL=ErrorResponse.js.map