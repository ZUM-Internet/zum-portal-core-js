import {container} from "tsyringe";

/**
 * tsyringe 컨테이너에 등록된 토큰인지 체크하는 함수
 *
 * @param token 유효성을 체크할 토큰
 */
export function isRegisteredToken(token) {
  try {
    container.resolve(token);
    return true;
  } catch (e) {
    return false;
  }
}
