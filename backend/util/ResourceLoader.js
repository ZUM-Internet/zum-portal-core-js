"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcePath = exports.ResourceLoader = exports.ResourceType = void 0;
// @ts-ignore
const path = require("path");
const fs = require("fs");
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["FILE"] = 0] = "FILE";
    ResourceType[ResourceType["JSON"] = 1] = "JSON";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
/**
 * Resources 폴더 내의 파일을 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 * @param resourceType 가져올 파일의 리소스 타입 (file: 0, json: 1)
 */
function ResourceLoader(filename, resourceType = ResourceType.FILE) {
    try {
        const filePath = path.join(process.env.INIT_CWD, './resources', filename);
        if (resourceType == ResourceType.JSON) {
            return require(filePath);
        }
        return fs.readFileSync(filePath);
    }
    catch (e) {
        throw e;
    }
}
exports.ResourceLoader = ResourceLoader;
/**
 * Resources 폴더 내의 파일 path를 가져오는 함수.
 *
 * @param filename 가져올 디렉토리/파일명
 */
function ResourcePath(filename) {
    return path.join(process.env.INIT_CWD, './resources', filename);
}
exports.ResourcePath = ResourcePath;
//# sourceMappingURL=ResourceLoader.js.map