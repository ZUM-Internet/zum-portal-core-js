"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZumProvisionAdapter = void 0;
/**
 * 줌 API 전용 어댑터
 */
const axios_1 = require("axios");
const Alias_1 = require("../decorator/Alias");
const deepmerge = require("deepmerge");
let ZumProvisionAdapter = class ZumProvisionAdapter {
    /**
     * GET 요청
     * @param option 요청할 옵션
     */
    get(option) {
        return this.request('get', option);
    }
    /**
     * POST 요청
     * @param option 요청할 옵션
     */
    post(option) {
        return this.request('post', option);
    }
    /**
     * DELETE 요청
     * @param option 요청할 옵션
     */
    delete(option) {
        return this.request('delete', option);
    }
    /**
     * PUT 요청
     * @param option 요청할 옵션
     */
    put(option) {
        return this.request('put', option);
    }
    /**
     * Axios 요청 메소드
     * @param method HTTP request 메소드
     * @param version 줌 provision API 버전
     * @param typeCheck 타입 체크를 위해 테스트할 함수
     * @param option 그 외 HTTP request 옵션
     */
    request(method, _a) {
        var { version, typePredicate } = _a, option = __rest(_a, ["version", "typePredicate"]);
        // publish모드이며 stub 데이터를 설정한 경우 지정된 값을 반환
        if (option.stub && process.env.ZUM_BACK_MODE === 'publish') {
            return Promise.resolve({
                data: option.stub,
                status: 200,
                statusText: 'ok',
                headers: [],
                config: option,
                request: method
            });
        }
        return axios_1.default(deepmerge(option, {
            timeout: 1500,
            headers: version !== undefined ? { Accept: `application/vnd.zum.resource-${version}+json` } : {},
        }))
            .then(response => {
            // 타입 체크 시도
            if (typePredicate && !typePredicate(response.data)) {
                const { status, statusText, data } = response;
                throw new Error(`\n[Type Check Error!] `
                    + `There is an error when Axios fetching ${option.url}. Response can not pass type check!\n`
                    + `response status: ${status} ${statusText}\n`
                    + `response data: ${data}\n\n`);
            }
            return response;
        });
    }
};
ZumProvisionAdapter = __decorate([
    Alias_1.Singleton()
], ZumProvisionAdapter);
exports.ZumProvisionAdapter = ZumProvisionAdapter;
//# sourceMappingURL=ZumProvisionAdapter.js.map