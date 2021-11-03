import {
  applyDecorators,
  SetMetadata
} from "@nestjs/common";

export const ZUM_CACHE_NAME = 'ZUM_CACHE_NAME';

export interface ZumCacheOptions {
  cron?: string;
  key?: string;
  ttl?: number;
  validate?: (value: any) => boolean;
  logger?: Function
}

export function ZumCache(
  options: ZumCacheOptions = {}
): MethodDecorator {
  return applyDecorators(
    SetMetadata(ZUM_CACHE_NAME, options),
  )
}
