export type ExtensionMessage<P = any, T = string> = {
  status?: number;
  messId?: string;
  type: T;
  payload: P;
};

export type onMessageCallbackType<M extends ExtensionMessage> = (message: M, tab?: chrome.tabs.Tab | browser.tabs.Tab) => void;

export class Messenger {
  sendMessage<T>(message: T): void;
  sendMessageGlobal<T>(message: T): void;
  sendMessageToTab<T>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T): void;
  sendMessageToTabAndGetResponse<T1, T2>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponse<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponseGlobal<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  onMessage<M extends ExtensionMessage>(cb: onMessageCallbackType<M>): void;
  offMessage<M extends ExtensionMessage>(cb: onMessageCallbackType<M>): void;
}

export default function(browserType: string): typeof Messenger;
