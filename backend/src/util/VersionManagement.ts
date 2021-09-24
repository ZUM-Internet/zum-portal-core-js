// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const containerImagePath = path.join(process.env.INIT_CWD, '../container_image_tag.txt');

// 도커 컨테이너 이미지 빌드 시간
console.log(process.env.INIT_CWD, containerImagePath);

const containerImageTag = glob.sync(containerImagePath)
                              .map(src => fs.readFileSync(src))
                              .join('');

/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 반환하는 함수
 */
export const getVersion = () => containerImageTag || process.env.npm_package_version;
