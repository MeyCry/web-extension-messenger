export default class ChromeMessenger {
  constructor() {
    chrome.runtime.onMessage.addListener(message => {
      const messageId = message.messageId;

      // Attach callback id and invoke function
      if (messageId && this.responses[messageId]) {
        this.responses[messageId](message);
        delete this.responses[messageId];
      }

      this.callbacks.forEach(callback => {
        callback(message);
      });
    });
  }

  /**
   * Send to all tabs or to background
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessage(message) {
    if (chrome.tabs) { // background
      chrome.tabs.query({windowType: "normal"}, function (tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      chrome.runtime.sendMessage(message);
    }
  }
}