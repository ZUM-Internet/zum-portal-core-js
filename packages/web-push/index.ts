// zum-news / app.js
import { register } from '@zum-front-core/web-push'

// 이 함수 내부에서는 "/firebase-messaging-sw.js" 서비스 워커를 등록함
// 그러므로 각 서비스에서는 /firebase-messaging-sw.js 파일이 있어야 함
register({
  firebaseConfig: { },
  onMessageHandler: () => {},
})

//-----------------------------------------------------------------------
// zum-news / firebase-messaging-sw.js
import { registerSW } from '@zum-front-core/web-push'

registerSW({
  firebaseConfig: { },
  onBackgroundMessageHanlder: () => {},
})

//-----------------------------------------------------------------------
// web-push/index.js
import { initializeApp } from 'firebase/app'
import { getToken } from 'firebase/messaging'

// ....

export { register, registerSW }
