export default class ChromeMessenger {
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender) => {
      const messId = message.messId;

      if (message.type === 'function') {
        // run some function
        console.log(message.content.function);
      }

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
   * Find active tab and send message to it
   * @param {object} message 
   */
  sendMessageToActiveTab(message) {
    chrome.tabs.query({active: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
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