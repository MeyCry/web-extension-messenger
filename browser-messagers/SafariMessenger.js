export default class SafariMessenger {
  constructor() {
    var addEventListener = function () {};
    var ctx = {};
    if (safari.self) { // client
      addEventListener = safari.self.addEventListener;
      ctx = safari.self;
    } else {
      addEventListener = safari.application.addEventListener;
      ctx = safari.application;
    }

    addEventListener.call(ctx ,'message', event => {
        const message = event.message;
        const messageId = message.messageId;

        // Attach callback id and invoke function
        if (messageId && this.responses[messageId]) {
          this.responses[messageId](message);
          delete this.responses[messageId];
        }

        this.callbacks.forEach(callback => {
          callback(message);
        });
      },
      false);
  }

  /**
   * @param {object} message - Message that will be sent to the all tabs.
   * @returns {void}
   */
  sendMessage(message) {
    if (safari.self) { // client
      safari.self.tab.dispatchMessage('message', message);
    } else { // background
      safari.application.browserWindows.forEach(browserWindow => {
        browserWindow.tabs.forEach(tab => {
          tab.page.dispatchMessage('message', message);
        });
      });
    }
  }

  // TODO: add sending by tab
  /*
  sendTabMessage: function (tab, message) {
    if (tab.page && tab.page.dispatchMessage) {
      tab.page.dispatchMessage("message", message);
    } else {
      setTimeout(function () {
        if (tab.page && tab.page.dispatchMessage) {
          tab.page.dispatchMessage("message", message);
        }
      }, 2000);
    }
  }
  */
}