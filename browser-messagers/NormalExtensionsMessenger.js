/**
 * https://browserext.github.io/browserext/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 *
 */
export default class NormalExtensionsMessenger {
  constructor() {
    browser.runtime.onMessage.addListener((message, sender) => {
      const messId = message.messId;

      this.callbacks.forEach(callback => {
        if (browser.tabs) { // background
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
    if (browser.tabs) { // background
      browser.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
          if (!tab.url || !/^(http|ws)/.test(tab.url)) {
            return;
          }
          browser.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      browser.runtime.sendMessage(message);
    }
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
