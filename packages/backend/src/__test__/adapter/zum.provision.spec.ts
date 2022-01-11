import { Test } from '@nestjs/testing';
import axios from 'axios';
import { ZumProvisionAdapter } from '../../base';
import { mockAPI, API_URL, API_VERSION } from './mock-api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.request.mockImplementation(mockAPI);

describe('ZumProvisionAdapter', () => {
  let adapter: ZumProvisionAdapter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ZumProvisionAdapter],
    }).compile();

    process.env.ZUM_BACK_MODE = undefined;
    adapter = moduleRef.get<ZumProvisionAdapter>(ZumProvisionAdapter);
  });

  /**
   * @Method GET
   */
  describe('get', () => {
    it('요청이 성공하면 axios 응답을 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;

      expect(await adapter.get({ url, version })).toMatchObject({ data: { message: 'success' } });
    });

    it('요청이 실패하면 그 결과를 reject해야한다', async () => {
      const url = 'https://wrong.zum.com';
      const version = API_VERSION;

      await expect(adapter.get({ url, version })).rejects.toStrictEqual({ status: 404 });
    });

    it('publish모드일 때는 입력받은 stub데이터로 응답해야 한다', async () => {
      const url = API_URL;
      const stub = { foo: 'bar', test: 'stub' };
      process.env.ZUM_BACK_MODE = 'publish';

      expect(await adapter.get({ url, stub })).toMatchObject({ data: stub });
    });

    it('headers, params, data 매개변수를 axios로 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const headers = { headerTest: 'foo' };
      const params = { paramTest: 'bar' };
      const data = { bodyTest: 'baz' };

      expect(await adapter.get({ url, version, headers, params, data })).toMatchObject({
        data: { headers, params, data },
      });
    });

    it('typePredicate 함수가 false를 반환하면 에러를 reject해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const typePredicate = ({ message }) => message !== 'success';

      await expect(adapter.get({ url, version, typePredicate })).rejects.toThrow('Type Check Error!');
    });
  });

  /**
   * @Method POST
   */
  describe('post', () => {
    it('요청이 성공하면 axios 응답을 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;

      expect(await adapter.post({ url, version })).toMatchObject({ data: { message: 'success' } });
    });

    it('요청이 실패하면 그 결과를 reject해야한다', async () => {
      const url = 'https://wrong.zum.com';
      const version = API_VERSION;

      await expect(adapter.post({ url, version })).rejects.toStrictEqual({ status: 404 });
    });

    it('publish모드일 때는 입력받은 stub데이터로 응답해야 한다', async () => {
      const url = API_URL;
      const stub = { foo: 'bar', test: 'stub' };
      process.env.ZUM_BACK_MODE = 'publish';

      expect(await adapter.post({ url, stub })).toMatchObject({ data: stub });
    });

    it('headers, params, data 매개변수를 axios로 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const headers = { headerTest: 'foo' };
      const params = { paramTest: 'bar' };
      const data = { bodyTest: 'baz' };

      expect(await adapter.post({ url, version, headers, params, data })).toMatchObject({
        data: { headers, params, data },
      });
    });

    it('typePredicate 함수가 false를 반환하면 에러를 reject해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const typePredicate = ({ message }) => message !== 'success';

      await expect(adapter.post({ url, version, typePredicate })).rejects.toThrow('Type Check Error!');
    });
  });

  /**
   * @Method PUT
   */
  describe('put', () => {
    it('요청이 성공하면 axios 응답을 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;

      expect(await adapter.put({ url, version })).toMatchObject({ data: { message: 'success' } });
    });

    it('요청이 실패하면 그 결과를 reject해야한다', async () => {
      const url = 'https://wrong.zum.com';
      const version = API_VERSION;

      await expect(adapter.put({ url, version })).rejects.toStrictEqual({ status: 404 });
    });

    it('publish모드일 때는 입력받은 stub데이터로 응답해야 한다', async () => {
      const url = API_URL;
      const stub = { foo: 'bar', test: 'stub' };
      process.env.ZUM_BACK_MODE = 'publish';

      expect(await adapter.put({ url, stub })).toMatchObject({ data: stub });
    });

    it('headers, params, data 매개변수를 axios로 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const headers = { headerTest: 'foo' };
      const params = { paramTest: 'bar' };
      const data = { bodyTest: 'baz' };

      expect(await adapter.put({ url, version, headers, params, data })).toMatchObject({
        data: { headers, params, data },
      });
    });

    it('typePredicate 함수가 false를 반환하면 에러를 reject해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const typePredicate = ({ message }) => message !== 'success';

      await expect(adapter.put({ url, version, typePredicate })).rejects.toThrow('Type Check Error!');
    });
  });

  /**
   * @Method DELETE
   */
  describe('delete', () => {
    it('요청이 성공하면 axios 응답을 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;

      expect(await adapter.delete({ url, version })).toMatchObject({ data: { message: 'success' } });
    });

    it('요청이 실패하면 그 결과를 reject해야한다', async () => {
      const url = 'https://wrong.zum.com';
      const version = API_VERSION;

      await expect(adapter.delete({ url, version })).rejects.toStrictEqual({ status: 404 });
    });

    it('publish모드일 때는 입력받은 stub데이터로 응답해야 한다', async () => {
      const url = API_URL;
      const stub = { foo: 'bar', test: 'stub' };
      process.env.ZUM_BACK_MODE = 'publish';

      expect(await adapter.delete({ url, stub })).toMatchObject({ data: stub });
    });

    it('headers, params, data 매개변수를 axios로 전달해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const headers = { headerTest: 'foo' };
      const params = { paramTest: 'bar' };
      const data = { bodyTest: 'baz' };

      expect(await adapter.delete({ url, version, headers, params, data })).toMatchObject({
        data: { headers, params, data },
      });
    });

    it('typePredicate 함수가 false를 반환하면 에러를 reject해야 한다', async () => {
      const url = API_URL;
      const version = API_VERSION;
      const typePredicate = ({ message }) => message !== 'success';

      await expect(adapter.delete({ url, version, typePredicate })).rejects.toThrow('Type Check Error!');
    });
  });
});
