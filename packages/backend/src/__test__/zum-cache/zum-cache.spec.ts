import { Test } from '@nestjs/testing';
import { INestApplication } from 'src/common';
import { ZumCache, ZumCacheModule, ZumCacheOptions, ZUM_CACHE_NAME } from '../../index';
import { cronServiceFactory, CronTestService, CronServiceFactoryProps } from './cron.service';

/** ms 단위 */
const Time = {
  ONE_HOUR: 1000 * 60 * 60,
  ONE_MINUTE: 1000 * 60,
} as const;

function testClassFactory(option: ZumCacheOptions) {
  class TestClass {
    @ZumCache(option)
    public testMethod(this: void) {
      return this;
    }
  }

  return TestClass;
}

describe('zum-cache decorator', () => {
  it('캐시 옵션을 데코레이터가 사용된 메소드의 메타데이터로 저장해야 한다', () => {
    const cacheOptions = { ttl: 30, logger: () => undefined, key: 'TEST_OPTION_KEY' };
    const TestClass = testClassFactory(cacheOptions);
    const testInstance = new TestClass();

    const metadata = Reflect.getMetadata(ZUM_CACHE_NAME, testInstance.testMethod);

    expect(metadata).toStrictEqual(cacheOptions);
  });
});

describe('zum-cache module', () => {
  let app: INestApplication;
  let cronService: CronTestService;

  async function createApplication(options?: CronServiceFactoryProps) {
    const CronServiceClass = cronServiceFactory(options);
    const moduleRef = await Test.createTestingModule({
      imports: [ZumCacheModule.forRoot()],
      providers: [CronServiceClass],
    }).compile();

    app = moduleRef.createNestApplication();
    cronService = app.get<CronTestService>(CronServiceClass);
  }

  beforeEach(async () => {
    await createApplication();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('앱이 실행되고 나면 메소드가 1번 실행되어야 한다', async () => {
    expect(cronService.minuteCount).toEqual(0);
    expect(cronService.hourCount).toEqual(0);

    await app.init();

    expect(cronService.minuteCount).toEqual(1);
    expect(cronService.hourCount).toEqual(1);
  });

  it('작업이 등록한 주기대로 실행되어야 한다', async () => {
    expect(cronService.minuteCount).toEqual(0);
    expect(cronService.hourCount).toEqual(0);

    await app.init();

    jest.advanceTimersByTime(Time.ONE_HOUR);

    // CronJob에 전달한 콜백은 async함수라서 비동기적으로 실행된다
    // micro-task queue에 추가된 콜백을 동기적으로 실행시키기 위해 await을 한번 해준다
    await Promise.resolve();

    // 앱이 초기화되고 기본적으로 한번 실행되기 때문에 1 더해준다
    expect(cronService.minuteCount).toEqual(61);
    expect(cronService.hourCount).toEqual(2);
  });

  it('캐싱이 적용된 메소드를 호출하면 캐싱된 데이터를 반환해야 한다', async () => {
    const cachableValue = 'HelloWorld!';

    cronService.setFetchResult(cachableValue);

    await app.init();

    expect(cronService.minuteCount).toEqual(1);
    expect(cronService.fetchResult).toEqual(cachableValue);
    expect(await cronService.fetchEveryMinute()).toEqual(cachableValue);
    expect(cronService.minuteCount).toEqual(1); // 메소드가 호출되지 않았는지 확인
  });

  it('유효하지 않은 값은 캐싱되지 않아야 한다', async () => {
    const cachableValue = 'ZumFront!';
    const nonCachableValue = null;

    cronService.setFetchResult(cachableValue);

    await app.init();

    cronService.setFetchResult(nonCachableValue);

    expect(cronService.fetchResult).toEqual(nonCachableValue);
    expect(await cronService.fetchEveryMinute()).toEqual(cachableValue);
  });

  it('시간이 지나서 새로 캐싱된 값이 있으면 새로운 값을 반환해야 한다', async () => {
    const cachableValue = 'me';
    const anotherCachableValue = 'you';

    cronService.setFetchResult(cachableValue);

    await app.init();

    expect(cronService.fetchResult).toEqual(cachableValue);
    expect(await cronService.fetchEveryMinute()).toEqual(cachableValue);

    cronService.setFetchResult(anotherCachableValue);

    jest.advanceTimersByTime(Time.ONE_MINUTE);
    await Promise.resolve().then();

    expect(cronService.fetchResult).toEqual(anotherCachableValue);
    expect(await cronService.fetchEveryMinute()).toEqual(anotherCachableValue);
  });

  it('설정한 validator대로 유효성 검사를 할 수 있어야 한다', async () => {
    // 짝수만 유효성 검사를 통과하도록 설정
    const cacheOptions = { validate: (val: any) => Number.isInteger(val) && val % 2 === 0 };
    await createApplication(cacheOptions);

    const cachableValue = 2;
    const nonCachableValue = 3;

    cronService.setFetchResult(cachableValue);

    await app.init();

    cronService.setFetchResult(nonCachableValue);

    expect(cronService.fetchResult).toEqual(nonCachableValue);
    expect(await cronService.fetchEveryMinute()).toEqual(cachableValue);
  });

  it('cron 스케줄러가 실행될 때 옵션으로 전달한 logger함수를 cacheKey, jobData를 파라미터로 전달하여 호출해야 한다', async () => {
    const logger = jest.fn();
    await createApplication({ logger });

    const cachableValue = 'LOGGER_CACHE_TEST_RESULT';

    cronService.setFetchResult(cachableValue);

    await app.init();

    expect(logger).toHaveBeenCalledTimes(2); // 메소드가 2개라서 2번
    expect(logger).toHaveBeenLastCalledWith({
      cacheKey: 'CronTestService.fetchEveryHour',
      jobData: cachableValue,
    });
  });
});
