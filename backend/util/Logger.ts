import * as Sentry from "@sentry/node";
const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function getTimestamp() {
  return `${new Date(Date.now() - timezoneOffset).toISOString()
          ?.replace(/[a-zA-Z]/g, ' ')
          ?.trimRight()}`;
}

/**
 * 서비스인프라팀에서 관리하는 로그 양식에 맞추기 위해 winston 제거
 */
export default {
  info(...args): void {
    return console.info(getTimestamp(), '[info]', ...args);
  },

  debug(...args): void {
    return console.debug(getTimestamp(), '[debug]', ...arguments);
  },

  log(...args): void {
    return console.log(getTimestamp(), '[log]', ...args);
  },

  warn(...args): void {
    return console.warn(getTimestamp(), '[warn]', ...args);
  },

  error(...args) {
    console.error(getTimestamp(), '[error]', ...args);
    Sentry.captureMessage(JSON.stringify(args));
  }
};
