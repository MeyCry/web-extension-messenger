export class Messenger {
  sendMessage<T>(message: T): void;
  sendMessageGlobal<T>(message: T): void;
  sendMessageToTab<T>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T): void;
  sendMessageToTabAndGetResponse<T1, T2>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponse<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  sendMessageAndGetResponseGlobal<T1, T2>(message: T1, timeToWaitResponse: number): Promise<T2>;
  onMessage<T>(cb: (message: T) => void): void;
  offMessage<T>(cb: (message: T) => void): void;
}

export default function(browserType: string): typeof Messenger;
