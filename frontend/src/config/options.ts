import { join } from "path";

const { INIT_CWD } = process.env;

export interface ZumOptions {
  frontSrcPath: string;
  resourcePath: string;
  outputPath: string;
  stubPath: string;
}

export const ZUM_OPTIONS: ZumOptions = {
  frontSrcPath: join(INIT_CWD, 'src'),
  resourcePath: join(INIT_CWD, '../resources'),
  outputPath: join(INIT_CWD, '../resources'),
  stubPath: join(INIT_CWD, '../resources', 'stub')
};

export function getZumOptions (): ZumOptions {
  return { ...ZUM_OPTIONS };
}

export function setZumOptions (newOptions: Partial<ZumOptions>) {
  Object.entries(newOptions)
        .filter(([ k ]) => ZUM_OPTIONS.hasOwnProperty(k))
        .forEach(([k, v]: [keyof ZumOptions, string]) => {
          ZUM_OPTIONS[k] = v;
        })
}
