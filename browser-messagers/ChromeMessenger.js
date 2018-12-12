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
   * Send to all tabs
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessageToContent(message) {
    if (chrome.tabs) { // background or popup
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, message);
        });
      });
    }
  }

  /**
   * Send to popup or to background
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessageGlobal(message) { // content
    chrome.runtime.sendMessage(message);
  }

  /**
   * Find active tab and send message to it
   * @param {object} tab
   * @param {object} message 
   * @returns {void}
   */
  sendMessageToTab(tab, message) {
    chrome.tabs.sendMessage(tab.id, message);
  }
}
