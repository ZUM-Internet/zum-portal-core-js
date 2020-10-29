"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const path = require("path");
const fs = require("fs");
/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
function ResourceLoader(filename) {
    try {
        return fs.readFileSync(path.join(process.env.INIT_CWD, './resources', filename));
    }
    catch (e) {
        throw e;
    }
}
exports.ResourceLoader = ResourceLoader;
/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
function ResourcePath(filename) {
    return path.join(process.env.INIT_CWD, './resources', filename);
}
exports.ResourcePath = ResourcePath;
//# sourceMappingURL=ResourceLoader.js.map