import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage, MessagePayload } from 'firebase/messaging';
import { onBackgroundMessage } from 'firebase/messaging/sw';

export interface ClientRegisterOptions {
  firebaseConfig: FirebaseOptions;
  vapidKey: string;
  onMessageHandler?: (payload: MessagePayload) => void;
  onPermissionGranted?: (token: string) => void;
  onPermissionDenied?: () => void;
  onPermissionError?: (err: unknown) => void;
}

export interface ServiceWorkerRegisterOptions extends Pick<ClientRegisterOptions, 'firebaseConfig'> {
  onBackgroundMessageHanlder?: (payload: MessagePayload) => void;
}

const defaultMessageHandler = (payload: MessagePayload) => {
  if (!{}.hasOwnProperty.call(window, 'Notification')) return;
  if (Notification.permission !== 'granted') return;
  // eslint-disable-next-line no-new
  new Notification(payload.notification?.title || '');
};

const registerClient = (options: ClientRegisterOptions) => {
  const {
    firebaseConfig,
    vapidKey,
    onMessageHandler,
    onPermissionDenied,
    onPermissionError,
    onPermissionGranted,
  } = options;

  initializeApp(firebaseConfig);

  const messaging = getMessaging();

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

  onMessage(messaging, onMessageHandler || defaultMessageHandler);
};

const registerServiceWorker = (options: ServiceWorkerRegisterOptions) => {
  const { firebaseConfig, onBackgroundMessageHanlder } = options;

  initializeApp(firebaseConfig);

  const messaging = getMessaging();

  onBackgroundMessage(messaging, onBackgroundMessageHanlder || defaultMessageHandler);
};

export const ZumWebPush = {
  registerClient,
  registerServiceWorker,
};
