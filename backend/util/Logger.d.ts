/**
 * 서비스인프라팀에서 관리하는 로그 양식에 맞추기 위해 winston 제거
 */
export declare const logger: {
    info(...args: any[]): void;
    debug(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
};
