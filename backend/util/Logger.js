"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
function getTimestamp() {
    var _a, _b;
    return `${(_b = (_a = new Date(Date.now() - timezoneOffset).toISOString()) === null || _a === void 0 ? void 0 : _a.replace(/[a-zA-Z]/g, ' ')) === null || _b === void 0 ? void 0 : _b.trimRight()}`;
}
/**
 * 서비스인프라팀에서 관리하는 로그 양식에 맞추기 위해 winston 제거
 */
exports.default = {
    info(...args) {
        return console.info(getTimestamp(), '[info]', ...args);
    },
    debug(...args) {
        return console.debug(getTimestamp(), '[debug]', ...arguments);
    },
    log(...args) {
        return console.log(getTimestamp(), '[log]', ...args);
    },
    warn(...args) {
        return console.warn(getTimestamp(), '[warn]', ...args);
    },
    error(...args) {
        return console.error(getTimestamp(), '[error]', ...args);
    }
};
//# sourceMappingURL=Logger.js.map