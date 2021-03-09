import {ZumDecoratorType} from "./ZumDecoratorType";
import {appendSchedule} from "./Component";

type ScheduleOptionFunction = () => ScheduleOption;

/**
 * 스케줄 등록 데코레이터
 * @param ScheduleOption 스케줄 등록 옵션
 * @param func
 * @constructor
 */
export function Scheduled(ScheduleOption: ScheduleOption | ScheduleOptionFunction, func?: Function): Function|void {

  if (func) {
    return appendSchedule(this, func, ScheduleOption);
  }

  return function (component, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(ZumDecoratorType.Scheduled, ScheduleOption, descriptor.value);
    return descriptor;
  }
}

/**
 * 스케줄 설정 옵션
 */
interface ScheduleOption {
  condition?: boolean; // 스케줄 실행 여부
  cron: string; // 스케줄 cron. ex) '0/30 * * * * *'
  cancel?: string; // 스케줄 취소 함수명. 데코레이터가 적용된 함수 내에 함수로 선언된다.
  runOnStart?: boolean; // 어플리케이션 기동시 실행 여부
}
