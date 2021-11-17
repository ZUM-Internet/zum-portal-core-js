import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { CronJob } from 'cron';
import { CACHE_MANAGER, CacheModule, DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ZUM_CACHE_NAME, ZumCacheOptions } from './zum-cache.decorator';

type AnyFunction = (...args: any[]) => any;

interface RegisterCronProps {
  cron: string;
  cacheKey: string;
  job: () => any;
  validate: (data: any) => boolean;
  logger: AnyFunction;
}

interface OverrideMethodProps {
  instance: Record<any, any>;
  originMethod: AnyFunction;
  methodName: string;
  cronCacheKey: string;
  cacheOption: ZumCacheOptions;
}

@Module({
  imports: [DiscoveryModule, CacheModule.register()],
})
export class ZumCacheModule implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  static forRoot(): DynamicModule {
    return {
      module: ZumCacheModule,
      global: true,
    };
  }

  onModuleInit() {
    this.registerAllCache();
  }

  private registerAllCache() {
    const { discovery, scanner } = this;
    [...discovery.getControllers(), ...discovery.getProviders()]
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        scanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          this.registerCacheAndJob(instance),
        );
      });
  }

  private static generateCronCacheKey(instance: Record<any, any>, methodName: string) {
    return `${instance.constructor.name}.${methodName}`;
  }

  private static generateCacheKey(key: string | undefined, args: unknown[]) {
    const keyBody = key ?? (args.length ? JSON.stringify(args) : '');
    return keyBody ? `(${keyBody})` : '';
  }

  private overrideMethod({
    instance,
    originMethod,
    methodName,
    cronCacheKey,
    cacheOption,
  }: OverrideMethodProps) {
    const { ttl = Infinity, key, logger = () => null, validate = Boolean } = cacheOption;

    instance[methodName] = async (...args: unknown[]) => {
      const cacheKey = cronCacheKey + ZumCacheModule.generateCacheKey(key, args);
      const cachedData = await this.cacheManager.get(cacheKey);

      logger({ cacheKey });

      if (cachedData) {
        logger({ cachedData });
        return cachedData;
      }

      const originMethodResult = (await originMethod(...args)) as unknown;

      if (!validate(originMethodResult)) {
        return cachedData;
      }

      logger({ originMethodResult });

      await this.cacheManager.set(cacheKey, originMethodResult, { ttl });

      return originMethodResult;
    };
  }

  private registerCacheAndJob(instance: Record<any, any>) {
    return (methodName: string) => {
      const methodRef = instance[methodName] as AnyFunction;
      const metadata: ZumCacheOptions = this.reflector.get(ZUM_CACHE_NAME, methodRef);

      if (!metadata) return;

      const { cron, validate = Boolean, logger = () => null } = metadata;
      const cronCacheKey = ZumCacheModule.generateCronCacheKey(instance, methodName);
      const originMethod: AnyFunction = methodRef.bind(instance);

      this.overrideMethod({ instance, originMethod, methodName, cronCacheKey, cacheOption: metadata });

      if (!cron) return;

      this.registerCron({ cron, cacheKey: cronCacheKey, job: originMethod, validate, logger });
    };
  }

  private registerCron({ cron, cacheKey, validate, job, logger }: RegisterCronProps) {
    const handleTick = async () => {
      const cachedData = await this.cacheManager.get(cacheKey);
      const jobData = (await job()) as unknown;

      logger({ cacheKey, jobData });

      this.cacheManager
        .set(cacheKey, validate(jobData) ? jobData : cachedData, { ttl: Infinity })
        .catch(() => {
          logger('An error occurred while saving the cache in cron');
        });

      return jobData;
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    new CronJob(cron, handleTick).start();

    handleTick().catch(() => {
      logger('An error occurred in first handleTick');
    });
  }
}
