import { ZumCache, ZumCacheOptions, CronExpression } from '../../index';

export interface CronTestService {
  minuteCount: number;
  hourCount: number;
  fetchResult: any;
  setFetchResult: (result: any) => void;
  fetchEveryMinute: () => any;
  fetchEveryHour: () => any;
}

export function cronServiceFactory({
  key,
  ttl,
  logger,
  validate,
}: Omit<ZumCacheOptions, 'cron'> = {}): new () => any {
  class CronTestService {
    public minuteCount = 0;

    public hourCount = 0;

    public fetchResult: unknown = null;

    public setFetchResult(result: any) {
      this.fetchResult = result;
    }

    @ZumCache({ cron: CronExpression.EVERY_MINUTE, key, ttl, logger, validate })
    public fetchEveryMinute() {
      this.minuteCount += 1;
      return this.fetchResult;
    }

    @ZumCache({ cron: CronExpression.EVERY_HOUR, key, ttl, logger, validate })
    public fetchEveryHour() {
      this.hourCount += 1;
      return this.fetchResult;
    }
  }

  return CronTestService;
}
