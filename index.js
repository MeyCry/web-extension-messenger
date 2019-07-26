import browser from "webextension-polyfill";

const withTimeout = (promise, timeout = 500) => {
  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(reject, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
};

export default class Messenger {
  constructor() {
    this.callbacks = [];

    browser.runtime.onMessage.addListener((message, sender) => {
      let response

      this.callbacks.forEach(callback => {
        const result = this.isBackground
          ? callback(message, sender.tab)
          : callback(message); // client

        if (result !== undefined) {
          if (response === undefined) {
            response = result;
          } else {
            throw new Error("Multiple responses for ", message);
          }
        }
      });

      return Promise.resolve(response);
    });
  }

  async _sendMessage(message) {
    if (this.isBackground) {
      const allTabs = await browser.tabs.query({});
      const responses = allTabs
        .filter(tab => tab.url && /^(http|ws)/.test(tab.url))
        .map(tab => this._sendMessageToTab(tab, message));

      return Promise.all(responses);
    } else { // client
      return this._sendMessageGlobal(message);
    }
  }

  _sendMessageGlobal(message) {
    return browser.runtime.sendMessage(message);
  }

  _sendMessageToTab(tab, message) {
    return browser.tabs.sendMessage(tab.id, message);
  }

  get isBackground() {
    return !!browser.tabs;
  }

  /**
   * Push callback to array of callbacks
   * @param {function} callback
   * @return {void}
   */
  onMessage(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Remove callback from array of callbacks
   * @param {function} callback
   * @return {void}
   */
  offMessage(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  /**
   * Send message to other messengers (content to global; global to content)
   * @param {Object} message to send
   * @return {void}
   */
  sendMessage(message) {
    this._sendMessage(message);
  }

  /**
   * Send message to other messengers and get promise with response(s)
   * @param {object} message to send
   * @param {number=} responseTimeout time in ms to wait for response
   * @return {Promise<object>} with response
   */
  sendMessageAndGetResponse(message, responseTimeout) {
    return withTimeout(this._sendMessage(message), responseTimeout);
  }

  /**
   * Send message to global messengers (to popup or background)
   * @param {Object} message to send
   * @return {void}
   */
  sendMessageGlobal(message) {
    this._sendMessageGlobal(message);
  }

  /**
   * Send message to global messengers and get promise with response
   * @param {object} message to send
   * @param {number=} responseTimeout time in ms to wait for response
   * @return {Promise<object>} with response
   */
  sendMessageGlobalAndGetResponse(message, responseTimeout) {
    return withTimeout(this._sendMessageGlobal(message), responseTimeout);
  }

  /**
   * Send message to particular tab
   * @param {object} tab message receiver
   * @param {object} message to send
   * @return {void}
   */
  sendMessageToTab(tab, message) {
    this._sendMessageToTab(tab, message);
  }

  /**
   * Send message to particular tab and get promise with response
   * @param {tab} tab message receiver
   * @param {object} message to send
   * @param {number=} responseTimeout time in ms to wait for response
   * @return {Promise<object>} with response
   */
  sendMessageToTabAndGetResponse(tab, message, responseTimeout) {
    return withTimeout(this._sendMessageToTab(tab, message), responseTimeout);
  }
}
