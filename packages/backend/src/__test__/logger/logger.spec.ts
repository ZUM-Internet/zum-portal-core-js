/* eslint-disable no-console */
import { logger, getTimestamp } from '../../util/logger';

describe('logger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTimestamp', () => {
    it('호출되면 타임스탬프를 반환해야 한다', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      expect(getTimestamp()).toEqual('2020-01-01 08:00:00.000');

      jest.useFakeTimers().setSystemTime(new Date('2021-12-25T11:30').getTime());

      expect(getTimestamp()).toEqual('2021-12-25 11:30:00.000');
    });
  });

  describe('info', () => {
    it('호출되면 console.info에 적절한 파라미터를 전달해야 한다', () => {
      console.info = jest.fn();
      const consoleInfoSpy = jest.spyOn(console, 'info');

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      logger.info();
      logger.info('abcd efg');
      logger.info('foo', ['bar', 324]);

      expect(consoleInfoSpy).toHaveBeenNthCalledWith(1, '2020-01-01 08:00:00.000', '[info]');
      expect(consoleInfoSpy).toHaveBeenNthCalledWith(2, '2020-01-01 08:00:00.000', '[info]', 'abcd efg');
      expect(consoleInfoSpy).toHaveBeenNthCalledWith(3, '2020-01-01 08:00:00.000', '[info]', 'foo', [
        'bar',
        324,
      ]);
    });
  });

  describe('debug', () => {
    it('호출되면 console.debug에 적절한 파라미터를 전달해야 한다', () => {
      console.debug = jest.fn();
      const consoleDebugSpy = jest.spyOn(console, 'debug');

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      logger.debug();
      logger.debug('abcd efg');
      logger.debug('foo', ['bar', 324]);

      expect(consoleDebugSpy).toHaveBeenNthCalledWith(1, '2020-01-01 08:00:00.000', '[debug]');
      expect(consoleDebugSpy).toHaveBeenNthCalledWith(2, '2020-01-01 08:00:00.000', '[debug]', 'abcd efg');
      expect(consoleDebugSpy).toHaveBeenNthCalledWith(3, '2020-01-01 08:00:00.000', '[debug]', 'foo', [
        'bar',
        324,
      ]);
    });
  });

  describe('log', () => {
    it('호출되면 console.log에 적절한 파라미터를 전달해야 한다', () => {
      console.log = jest.fn();
      const consoleLogSpy = jest.spyOn(console, 'log');

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      logger.log();
      logger.log('abcd efg');
      logger.log('foo', ['bar', 324]);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, '2020-01-01 08:00:00.000', '[log]');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, '2020-01-01 08:00:00.000', '[log]', 'abcd efg');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, '2020-01-01 08:00:00.000', '[log]', 'foo', [
        'bar',
        324,
      ]);
    });
  });

  describe('warn', () => {
    it('호출되면 console.warn에 적절한 파라미터를 전달해야 한다', () => {
      console.warn = jest.fn();
      const consoleWarnSpy = jest.spyOn(console, 'warn');

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      logger.warn();
      logger.warn('abcd efg');
      logger.warn('foo', ['bar', 324]);

      expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, '2020-01-01 08:00:00.000', '[warn]');
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(2, '2020-01-01 08:00:00.000', '[warn]', 'abcd efg');
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(3, '2020-01-01 08:00:00.000', '[warn]', 'foo', [
        'bar',
        324,
      ]);
    });
  });

  describe('error', () => {
    it('호출되면  console.error에 적절한 파라미터를 전달해야 한다', () => {
      console.error = jest.fn();
      const consoleErrorSpy = jest.spyOn(console, 'error');

      jest.useFakeTimers().setSystemTime(new Date('2020-01-01T08:00').getTime());

      logger.error();
      logger.error('abcd efg');
      logger.error('foo', ['bar', 324]);

      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, '2020-01-01 08:00:00.000', '[error]');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, '2020-01-01 08:00:00.000', '[error]', 'abcd efg');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(3, '2020-01-01 08:00:00.000', '[error]', 'foo', [
        'bar',
        324,
      ]);
    });
  });
});
