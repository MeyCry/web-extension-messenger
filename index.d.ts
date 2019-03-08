export class Messenger {
  sendMessageToTab<T>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T): void;
  sendMesssageToTabAndGetResponse<T1, T2>(tab: chrome.tabs.Tab | browser.tabs.Tab, message: T1, timeToWaitResponse: number): Promise<T2>;
  onMessage<T>(cb: (message: T) => void): void;
  offMessage<T>(cb: (message: T) => void): void;
  sendMessage<T>(message: T): void;
  sendMessageGlobal<T>(message: T): void;
  sendMessageAndGetResponse<T1, T2>(message: T1): Promise<T2>;
  sendMessageAndGetResponseGlobal<T1, T2>(message: T1): Promise<T2>;
}

export default function(browserType: string): typeof Messenger;