// This file is unused and obsolete
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
        const messId = message.messId;

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
        if (messId && self.responses[messId]) {
            self.responses[messId](message);
            delete self.responses[messId];
        }
      },
      false);
  }

  /**
   * @param {object} message - Message that will be sent to the all tabs from global, or from content to global.
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
      if (window.safari && window.safari.self && window.safari.self.tab && window.safari.self.tab.dispatchMessage) {
          window.safari.self.tab.dispatchMessage('message', message);
      } else {
        setTimeout(function () {
            if (window.safari && window.safari.self && window.safari.self.tab && window.safari.self.tab.dispatchMessage) {
                window.safari.self.tab.dispatchMessage('message', message);
            }
        }, 1000);
      }
    }
  }

  /**
   * @param {object} message - Message that will be sent to popup or bg.
   * @returns {void}
   */
  sendMessageGlobal(message) {
    if (window.safari && window.safari.self && window.safari.self.tab && window.safari.self.tab.dispatchMessage) {
      window.safari.self.tab.dispatchMessage('message', message);
    } else {
      setTimeout(function () {
        if (window.safari && window.safari.self && window.safari.self.tab && window.safari.self.tab.dispatchMessage) {
          window.safari.self.tab.dispatchMessage('message', message);
        }
      }, 1000);
    }
  }

  /**
   * Find active tab and send message to it
   * @param {object} tab
   * @param {object} message 
   * @returns {void}
   */
  sendMessageToTab(tab, message) {
    if (tab && tab.page && tab.page.dispatchMessage) {
      tab.page.dispatchMessage('message', message);
    } else {
      setTimeout(function () {
        if (tab && tab.page && tab.page.dispatchMessage) {
          tab.page.dispatchMessage('message', message);
        }
      }, 1000);
    }
  }
}