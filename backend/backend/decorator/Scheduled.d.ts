declare type ScheduleOptionFunction = () => ScheduleOption;
/**
 * 스케줄 등록 데코레이터
 * @param ScheduleOption 스케줄 등록 옵션
 * @constructor
 */
export declare function Scheduled(ScheduleOption: ScheduleOption | ScheduleOptionFunction): (component: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * 스케줄 설정 옵션
 */
interface ScheduleOption {
    condition?: boolean;
    cron: string;
    cancel?: string;
    runOnStart?: boolean;
}
export {};
