/**
 * https://browserext.github.io/browserext/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 *
 */
export default class NormalExtensionsMessenger {
  constructor() {
    browser.runtime.onMessage.addListener(message => {
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
    if (browser.tabs) { // background
      browser.tabs.query({windowType: "normal"}, function (tabs) {
        tabs.forEach(tab => {
          browser.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      browser.runtime.sendMessage(message);
    }
  }
}