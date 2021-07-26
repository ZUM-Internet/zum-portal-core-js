"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = void 0;
// @ts-nocheck
const fs = require("fs");
const path = require("path");
const glob = require("glob");
// 도커 컨테이너 이미지 빌드 시간
console.log(process.env.INIT_CWD, path.join(process.env.INIT_CWD, 'container_image_tag.txt'));
const containerImageTag = glob.sync(path.join(process.env.INIT_CWD, 'container_image_tag.txt'))
    .map(src => fs.readFileSync(src))
    .join('');
/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 반환하는 함수
 */
const getVersion = () => containerImageTag || process.env.npm_package_version;
exports.getVersion = getVersion;
//# sourceMappingURL=VersionManagement.js.map