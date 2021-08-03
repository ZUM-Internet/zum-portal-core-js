const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function getTimestamp() {
  return `${new Date(Date.now() - timezoneOffset).toISOString()
          ?.replace(/[a-zA-Z]/g, ' ')
          ?.trimRight()}`;
}

/**
 * 서비스인프라팀에서 관리하는 로그 양식에 맞추기 위해 winston 제거
 */
export const logger = {
  info(...args): void {
    console.info(getTimestamp(), '[info]', ...args);
  },

  debug(...args): void {
    console.debug(getTimestamp(), '[debug]', ...args);
  },

  log(...args): void {
    console.log(getTimestamp(), '[log]', ...args);
  },

  warn(...args): void {
    console.warn(getTimestamp(), '[warn]', ...args);
  },

  error(...args) {
    console.error(getTimestamp(), '[error]', ...args);
  }
};
