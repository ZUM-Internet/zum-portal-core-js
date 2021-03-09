"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCookieJar = exports.bundleRendering = void 0;
const jsdom_1 = require("jsdom");
const RenderingUserAgent_1 = require("./RenderingUserAgent");
/**
 * Vue SSR 번들 렌더링 함수
 *
 * @param renderer 번들 렌더러
 * @param RenderingOption 렌더링 옵션
 */
function bundleRendering(renderer, RenderingOption) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        global.document = jsdom_1.jsdom(``, {
            url: RenderingOption.projectDomain,
            userAgent: (RenderingOption === null || RenderingOption === void 0 ? void 0 : RenderingOption.userAgent.toLowerCase()) || RenderingUserAgent_1.renderingUserAgent.mobile.android,
            cookieJar: RenderingOption.cookieJar
        });
        global.window = document.defaultView;
        global.location = window.location;
        global.navigator = window.navigator;
        global.localStorage = {
            getItem(key) {
                return this[key] || null;
            },
            setItem(key, value) {
                this[key] = value;
            }
        };
        global.window.resizeTo(((_a = RenderingOption === null || RenderingOption === void 0 ? void 0 : RenderingOption.windowSize) === null || _a === void 0 ? void 0 : _a.width) || 375, ((_b = RenderingOption === null || RenderingOption === void 0 ? void 0 : RenderingOption.windowSize) === null || _b === void 0 ? void 0 : _b.height) || 812);
        // Window 객체에 바인드
        for (let field in RenderingOption === null || RenderingOption === void 0 ? void 0 : RenderingOption.windowObjects) {
            if (!RenderingOption.windowObjects.hasOwnProperty(field))
                continue;
            global.window[field] = RenderingOption.windowObjects[field];
        }
        // Vue SSR
        let result = '';
        try {
            result = yield renderer.renderToString(RenderingOption.rendererContext || {});
        }
        catch (e) {
            throw new Error(`There is an error when SSR bundleRendering ${e}`);
        }
        // JSDOM close 이후 결과 반환
        global.window.close();
        return result;
    });
}
exports.bundleRendering = bundleRendering;
/**
 * JSDOM에서 사용 가능한 CookieJar 객체를 생성하는 함수
 *
 * @param domain 쿠키를 적용할 도메인
 * @param cookieObject 쿠키 객체
 */
function createCookieJar(domain, cookieObject) {
    // 쿠키 문자열 생성
    let cookieString = '';
    for (let [key, value] of Object.entries(cookieObject)) {
        cookieString += `${key}=${value}; `;
    }
    // CookieJar 객체 생성
    const cookieJar = jsdom_1.createCookieJar();
    cookieJar.setCookie(cookieString, // 쿠키 문자열
    domain, // 쿠키를 적용할 도메인 
    {}, // 옵션
    () => { } // 콜백
    );
    return cookieJar;
}
exports.createCookieJar = createCookieJar;
//# sourceMappingURL=BundleRendering.js.map