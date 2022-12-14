import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getToken, getMessaging, onMessage, MessagePayload } from 'firebase/messaging';
import {
  onBackgroundMessage as handleBackgroundMessage,
  getMessaging as getMessageInSW,
} from 'firebase/messaging/sw';

export interface ForegroundMessageOptions {
  firebaseConfig: FirebaseOptions;
  vapidKey: string;
  onMessageHandler?: (payload: MessagePayload) => void;
  onPermissionGranted?: (token: string) => void;
  onPermissionDenied?: () => void;
  onPermissionError?: (err: unknown) => void;
}

export interface BackgroundMessageOptions {
  onBackgroundMessageHandler?: (payload: MessagePayload) => void;
  firebaseConfig: FirebaseOptions;
}

const defaultForegroundMessageHandler = (payload: MessagePayload) => {
  if (!{}.hasOwnProperty.call(window, 'Notification')) return;
  if (Notification.permission !== 'granted') return;

  new Notification(payload.notification?.title || '');
};

const defaultBackgroundMessageHandler = (payload: MessagePayload) => {
  if (!payload.notification) return;

  const { title = '', body } = payload.notification;
  const notificationOptions = { body };

  (self as unknown as ServiceWorkerGlobalScope).registration
    .showNotification(title, notificationOptions)
    .catch(() => {});
};

const onForegroundMessage = (options: ForegroundMessageOptions) => {
  const {
    firebaseConfig,
    vapidKey,
    onMessageHandler,
    onPermissionDenied,
    onPermissionError,
    onPermissionGranted,
  } = options;

  const firebaseApp = initializeApp(firebaseConfig);
  const messaging = getMessaging(firebaseApp);
  getAnalytics(firebaseApp);

  getToken(messaging, { vapidKey })
    .then((currentToken) => {
      if (!currentToken) {
        // 권한 거부한 상태
        onPermissionDenied?.();
        return;
      }
      // token을 서버로 보내야 함
      // API 호출 로직
      onPermissionGranted?.(currentToken);
    })
    .catch(onPermissionError);

  onMessage(messaging, onMessageHandler || defaultForegroundMessageHandler);
};

const onBackgroundMessage = (options: BackgroundMessageOptions) => {
  const { firebaseConfig, onBackgroundMessageHandler } = options;

  const firebaseApp = initializeApp(firebaseConfig);
  const messaging = getMessageInSW(firebaseApp);

  handleBackgroundMessage(messaging, onBackgroundMessageHandler || defaultBackgroundMessageHandler);
};

export const ZumWebPush = {
  onForegroundMessage,
  onBackgroundMessage,
};
