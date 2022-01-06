import path from 'path';
import fs from 'fs';

/**
 * 초기 디렉토리부터 루트 디렉토리까지 지정한 파일을 찾는 함수
 * 없으면 null을 반환한다
 */
export function findFilePath(initDir: string, filename: string): string | null {
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
