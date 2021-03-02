// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import {NextFunction, Request, Response} from "express";

// 도커 컨테이너 이미지 빌드 시간
console.log(
  process.env.INIT_CWD,
  path.join(process.env.INIT_CWD, 'container_image_tag.txt'),
)
const containerImageTag = glob.sync(path.join(process.env.INIT_CWD, 'container_image_tag.txt'))
                              .map(src => fs.readFileSync(src))
                              .join('');

/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 반환하는 미들웨어
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction) {
  res.send(containerImageTag || process.env.npm_package_version);
}
