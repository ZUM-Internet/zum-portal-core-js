"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const fs = require("fs");
const path = require("path");
const glob = require("glob");
// 도커 컨테이너 이미지 빌드 시간
const containerImageTag = glob.sync(path.resolve(process.env.INIT_CWD, 'container_image_tag.txt'))
    .map(src => fs.readFileSync(src))
    .join('');
/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 반환하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
function default_1(req, res, next) {
    res.send(containerImageTag || process.env.npm_package_version);
}
exports.default = default_1;
//# sourceMappingURL=VersionResponse.js.map