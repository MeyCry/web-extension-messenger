export default class SafariMessenger {
  constructor() {
    var ctx = {};
    if (window.safari.application) { // background
      ctx = window.safari.application;
    } else { // client
      ctx = window.safari.self;
    }

    const self = this;
    ctx.addEventListener('message', function (event) {
        const message = event.message;
        const messageId = message.messageId;

        self.callbacks.forEach(callback => {
          if (window.safari.application) { // background
            let tab = event.target;

            if (tab.toString() === '[object SafariBrowserWindow]') {
              tab = tab.activeTab;
            }
            callback(message, tab);
          } else { // client
            callback(message);
          }
        });
        // Attach callback id and invoke function
        if (messageId && self.responses[messageId]) {
            self.responses[messageId](message);
            delete self.responses[messageId];
        }
      },
      false);
  }

  /**
   * @param {object} message - Message that will be sent to the all tabs.
   * @returns {void}
   */
  sendMessage(message) {
    if (window.safari.application) { // background
      window.safari.application.browserWindows.forEach(browserWindow => {
        browserWindow.tabs.forEach(tab => {
          if (tab && tab.page && tab.page.dispatchMessage) {
            tab.page.dispatchMessage('message', message);
          }
        });
      });
    } else { // client
      window.safari.self.tab.dispatchMessage('message', message);
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