import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { CronJob } from 'cron';
import { CACHE_MANAGER, CacheModule, DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { ZUM_CACHE_NAME, ZumCacheOptions } from './zum-cache.decorator';

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

  registerAllCache() {
    const { discovery, cacheManager, scanner, reflector } = this;
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

  registerCacheAndJob(instance) {
    const { cacheManager, reflector } = this;
    return (key) => {
      const methodRef = instance[key];
      const metadata: ZumCacheOptions = reflector.get(ZUM_CACHE_NAME, methodRef);
      if (!metadata) return;

      const { ttl = Infinity, cron, key: customKey, validate = Boolean, logger = () => null } = metadata;

      const cacheKeyPrefix = `${instance.constructor.name}.${key}`;
      const originMethod = (...args: unknown[]) => methodRef.call(instance, ...args);

      instance[key] = async (...args: unknown[]) => {
        const key = customKey ? customKey : args.length ? JSON.stringify(args) : null;
        const cacheKeySuffix = key ? `(${key})` : '';
        const cacheKey = cacheKeyPrefix + cacheKeySuffix;
        const cached = await cacheManager.get(cacheKey);

        logger({ cacheKey });

        if (Boolean(cached)) {
          logger({ cached });
          return cached;
        }

        const data = await originMethod(...args);

        if (!validate(data)) {
          return cached;
        }

        logger({ data });

        await cacheManager.set(cacheKey, data, { ttl });
        return data;
      };

      if (!cron) return;
      this.registerCron(cron, cacheKeyPrefix, originMethod, validate, logger);
    };
  }

  registerCron(cron: string, cacheKey: string, job: Function, validate: Function, logger: Function) {
    const { cacheManager } = this;
    const handleTick = async () => {
      const cached = await cacheManager.get(cacheKey);
      const jobData = await job();
      logger({ cacheKey, jobData });
      await cacheManager.set(cacheKey, validate(jobData) ? jobData : cached, { ttl: Infinity });
      return jobData;
    };

    new CronJob(cron, handleTick).start();
    handleTick();
  }
}
