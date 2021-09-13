import { join } from "path";

const { INIT_CWD } = process.env;

export interface ZumOptions {
  frontSrcPath: string;
  resourcePath: string;
  outputPath: string;
  stubPath: string;
  publicPath: string;
}

export interface ZumVuePage {
  entry: string;
  ssrEntry: string;
  template: string;         // 원본 템플릿 파일
  publishTemplate: string;  // 퍼블리시 모드에서 사용할 템플릿 파일
  filename: string;         // 빌드 후 템플릿 파일
}

export type ZumVuePages = Record<string, ZumVuePage>;

export const ZUM_OPTIONS: ZumOptions = {
  frontSrcPath: join(INIT_CWD, 'src'),
  resourcePath: join(INIT_CWD, '../resources'),
  outputPath: join(INIT_CWD, '../resources'),
  stubPath: join(INIT_CWD, '../resources', 'stub'),
  publicPath: "/",
};

export function getZumOptions (): ZumOptions {
  return { ...ZUM_OPTIONS };
}

export function getVuePages (): Record<string, ZumVuePage> {
  const { frontSrcPath } = getZumOptions();
  return require(frontSrcPath + '/vue.page');
}

export function setZumOptions (newOptions: Partial<ZumOptions>) {
  Object.entries(newOptions)
        .filter(([ k ]) => ZUM_OPTIONS.hasOwnProperty(k))
        .forEach(([k, v]: [keyof ZumOptions, string]) => {
          ZUM_OPTIONS[k] = v;
        })
}
