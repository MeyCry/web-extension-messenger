export default class Messenger {
  sendMessage<T>(message: T): void;
  sendMessageAndGetResponse<T1, T2>(message: T1, responseTimeout?: number): Promise<T2>;
  sendMessageGlobal<T>(message: T): void;
  sendMessageGlobalAndGetResponse<T1, T2>(message: T1, responseTimeout?: number): Promise<T2>;
  sendMessageToTab<T>(tab: browser.tabs.Tab, message: T): void;
  sendMessageToTabAndGetResponse<T1, T2>(tab: browser.tabs.Tab, message: T1, responseTimeout?: number): Promise<T2>;

  onMessage<T>(cb: (message: T) => void): void;
  offMessage<T>(cb: (message: T) => void): void;
}
