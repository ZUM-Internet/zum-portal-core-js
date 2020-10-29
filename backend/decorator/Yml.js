"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const glob = require("glob");
const path = require("path");
const yaml_config = require("node-yaml-config");
const ZumDecoratorType_1 = require("./ZumDecoratorType");
const Logger_1 = require("../util/Logger");
const TokenCheck_1 = require("../util/TokenCheck");
// Yml파일 컨테이너 토큰명을 가져오는 함수
exports._getYmlToken = (filename) => `${ZumDecoratorType_1.ZumDecoratorType.PREFIX}yml__${filename}`;
/**
 * 리소스 폴더 내의 yml 설정 파일을 객체로 가져오는 데코레이터
 * @param filename 가져올 Yml 파일명
 */
function Yml(filename) {
    try {
        const token = exports._getYmlToken(filename);
        // @ts-ignore
        if (TokenCheck_1.isRegisteredToken(token)) {
            tsyringe_1.container.resolve(token);
        }
        else {
            const files = glob.sync(path.join(process.env.INIT_CWD, `./resources/**/${filename}.{yaml,yml}`));
            if (files.length) {
                files.forEach(src => tsyringe_1.container.register(token, { useValue: yaml_config.load(src) }));
            }
            else {
                tsyringe_1.container.register(token, { useValue: '' });
            }
        }
        return tsyringe_1.inject(token);
    }
    catch (e) {
        Logger_1.default.error(`Can not find ${filename}.yml file in resources folder.`);
        return null;
    }
}
exports.Yml = Yml;
//# sourceMappingURL=Yml.js.map