import {container, inject, injectable, singleton} from "tsyringe";
import InjectionToken from "tsyringe/dist/typings/providers/injection-token";
import {Component} from "./Component";
import logger from "../util/Logger";
import {isRegisteredToken} from "../util/TokenCheck";

export function Singleton(){
  return function (constructor) {
    singleton()(constructor);
  }
}

export function Injectable(){
  return function (constructor) {
    injectable()(constructor);
  }
}

export function Inject(injectionToken: InjectionToken) {
  if (isRegisteredToken(injectionToken)) {
    return inject(injectionToken);
  } else {
    logger.error(`Can not find any instance matched '${injectionToken.toString()}'`);
    return null;
  }
}

export function Service(){
  return function (constructor) {
    Component()(constructor);
  }
}

export function Facade(){
  return function (constructor) {
    Component()(constructor);
  }
}

export function Scheduler(){
  return function (constructor) {
    Component()(constructor);
  }
}
