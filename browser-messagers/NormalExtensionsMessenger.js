/**
 * https://browserext.github.io/browserext/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 *
 */
export default class NormalExtensionsMessenger {
  constructor() {
    // I don't know why, but in some cases edge lost context.
    this.browser = browser;

    this.browser.runtime.onMessage.addListener((message, sender) => {
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
   * Send to all tabs from background or popup, or to background or popup from content
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessage(message) {
    if (this.browser.tabs) { // background
      this.browser.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
          if (!tab.url || !/^(http|ws)/.test(tab.url)) {
            return;
          }
          this.browser.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      this.browser.runtime.sendMessage(message);
    }
  }

  /**
   * Send to popup or to background
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessageGlobal(message) {
    this.browser.runtime.sendMessage(message);
  }

  /**
   * Find active tab and send message to it
   * @param {object} tab
   * @param {object} message 
   * @returns {void}
   */
  sendMessageToTab(tab, message) {
    this.browser.tabs.sendMessage(tab.id, message);
  }
}
