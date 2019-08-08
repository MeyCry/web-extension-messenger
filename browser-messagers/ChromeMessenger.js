export default class ChromeMessenger {
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender) => {
      const messId = message.messId;

      if (messId) {
        // Attach callback id and invoke function
        if (this.responses[messId]) {
            this.responses[messId](message);
            delete this.responses[messId];
            return;
        }
        if (message.response) {
          return;
        }
      }

      this.callbacks.forEach(callback => {
        if (chrome.tabs) { // background
          callback(message, sender.tab);
        } else { // client
          callback(message);
        }
      });
    });
  }

  /**
   * Send to all tabs from background or popup, or to background or popup from content
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessage(message) {
    if (chrome.tabs) { // background
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      chrome.runtime.sendMessage(message);
    }
  }

  /**
   * Send to popup or to background
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessageGlobal(message) {
    chrome.runtime.sendMessage(message);
  }

  /**
   * Find active tab and send message to it
   * @param {object} tab
   * @param {object} message 
   * @returns {void}
   */
  sendMessageToTab(tab, message) {
    if (tab) {
      chrome.tabs.sendMessage(tab.id, message);
    } else {
      console.error('tab does not exist');
    }
  }
}
