import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { Request, Response } from 'express';
import { logger } from '../util';

/**
 * 초기 디렉토리부터 루트 디렉토리까지 지정한 파일을 찾는 함수
 * 없으면 null을 반환한다
 */
function findFilePath(initDir: string, filename: string): string | null {
  if (filename.startsWith('/') || filename.startsWith('..')) {
    throw new Error('filename must be just a filename');
  }

  function find(dir: string, name: string): string | null {
    const filePath = path.join(dir, name);

    function nextLevel() {
      if (dir === path.resolve('/')) return null;
      return find(path.dirname(dir), name);
    }

    try {
      if (fs.statSync(filePath).isFile()) return filePath;
      return nextLevel();
    } catch (e) {
      return nextLevel();
    }
  }

  return find(initDir, filename);
}

const containerImagePath = findFilePath(process.env.INIT_CWD || process.cwd(), 'container_image_tag.txt');

// 도커 컨테이너 이미지 빌드 시간
logger.log(process.env.INIT_CWD, containerImagePath);

const containerImageTag = containerImagePath
  ? glob
      .sync(containerImagePath)
      .map((src) => fs.readFileSync(src))
      .join('')
  : null;

/**
 * 특정 URL 접속시 컨테이너 이미지 태그 혹은 프로젝트 버전을 응답하는 미들웨어
 */
export const getVersion = (req: Request, res: Response) => {
  res.send(containerImageTag || process.env.npm_package_version);
};
