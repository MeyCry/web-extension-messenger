export type ExtensionMessage<P, T> = {
  status?: number;
  messId?: string;
  type: T;
  payload: P;
};

export type onMessageCallbackType<T, P> = (message: ExtensionMessage<P, T>, tab?: Record<string, any>) => void;

export class Messenger {
  sendMessage<T>(message: T): void;
  sendMessageGlobal<T>(message: T): void;
  sendMessageToTab<T>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T): void;
  sendMessageToTabAndGetResponse<T1, T2>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponse<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponseGlobal<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  onMessage<T, P>(cb: onMessageCallbackType<T, P>): void;
  offMessage<T, P>(cb: onMessageCallbackType<T, P>): void;
}

export default function(browserType: string): typeof Messenger;
