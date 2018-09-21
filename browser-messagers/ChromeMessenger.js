export default class ChromeMessenger {
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender) => {
      const messId = message.messId;

      this.callbacks.forEach(callback => {
        if (chrome.tabs) { // background
          callback(message, sender.tab);
        } else { // client
          callback(message);
        }
      });
      // Attach callback id and invoke function
      if (messId && this.responses[messId]) {
          this.responses[messId](message);
          delete this.responses[messId];
      }
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