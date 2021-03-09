"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = exports.Facade = exports.Service = exports.Inject = exports.Injectable = exports.Singleton = void 0;
const tsyringe_1 = require("tsyringe");
const Component_1 = require("./Component");
const Logger_1 = require("../util/Logger");
const TokenCheck_1 = require("../util/TokenCheck");
function Singleton() {
    return function (constructor) {
        tsyringe_1.singleton()(constructor);
    };
}
exports.Singleton = Singleton;
function Injectable() {
    return function (constructor) {
        tsyringe_1.injectable()(constructor);
    };
}
exports.Injectable = Injectable;
function Inject(injectionToken) {
    if (TokenCheck_1.isRegisteredToken(injectionToken)) {
        return tsyringe_1.inject(injectionToken);
    }
    else {
        Logger_1.default.error(`Can not find any instance matched '${injectionToken.toString()}'`);
        return null;
    }
}
exports.Inject = Inject;
function Service() {
    return function (constructor) {
        Component_1.Component()(constructor);
    };
}
exports.Service = Service;
function Facade() {
    return function (constructor) {
        Component_1.Component()(constructor);
    };
}
exports.Facade = Facade;
function Scheduler() {
    return function (constructor) {
        Component_1.Component()(constructor);
    };
}
exports.Scheduler = Scheduler;
//# sourceMappingURL=Alias.js.map