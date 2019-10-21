import guid from "./guid";
import ChromeMessenger from "./browser-messagers/ChromeMessenger";
import NormalExtensionsMessenger from "./browser-messagers/NormalExtensionsMessenger";
import SafariMessenger from "./browser-messagers/SafariMessenger";

/**
 * type definition
 * @typedef {object} Implementations
 * @property {object} chrome - Chrome implementations
 * @property {object} safari - Safari implementations
 * @property {object} firefoxOrEdge - Firefox and Edge implementations
 */


export default function (browserType) {
  const Implementations = {
    chrome: ChromeMessenger,
    safari: SafariMessenger,
    firefoxOrEdge: NormalExtensionsMessenger,
    "": class NoClass {}
  }[browserType];

  return class Messenger extends Implementations {
    constructor() {
      super();
      this.callbacks = [];
      this.responses = {};
    }

    /**
     * Send message to tab
     * @param {object} tab
     * @param {object}  message
     * @return {void}
     */
    sendMessageToTab(tab, message) {
      if (!tab || !tab.id) {
        console.error('No tab to send message: ' + message.type);
        return;
      }
      if (message.messId) {
        message.response = true;
      }
      super.sendMessageToTab(tab, message);
    }

    /**
     * Push callback in array of callbacks
     * @param {function} callback
     * @return {void}
     */
    onMessage(callback) {
      this.callbacks.push(callback);
    }

    /**
     * Remove callback from array of callbacks
     * @param {function} callback
     * @return {void}
     */
    offMessage(callback) {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    /**
     * send message to other messengers (content to global; global to content)
     * @param {object} message
     */
    sendMessage(message) {
      if (message.messId) {
        message.response = true;
      }
      super.sendMessage(message);
    }

    /**
     * send message to other messengers (content to global; global to global)
     * @param {object} message
     */
    sendMessageGlobal(message) {
      if (message.messId) {
        message.response = true;
      }
      super.sendMessageGlobal(message);
    }

    registerCallback(message, timeToWaitResponse = 500) {
      if (!message.messId) {
        message.messId = guid();
      } else {
        message.response = true;
      }

      return new Promise((resolve, reject) => {
        var timer = null;
        this.responses[message.messId] = function (response) {
          clearTimeout(timer);
          resolve(response);
        };

        timer = setTimeout(() => {
          delete this.responses[message.messId];
          reject(`Did not received response for message: ${message.type}. Wait was: ${timeToWaitResponse}`);
        }, timeToWaitResponse);

      });
    }

    /**
     * Send message to tab and get promise with response
     * @param {tab} tab
     * @param {object} message
     * @param {number} timeToWaitResponse time in ms what we wait response
     * @return {Promise<object>}
     */
    sendMessageToTabAndGetResponse(tab, message, timeToWaitResponse = 500) {
      if (!tab || !tab.id) {
        return Promise.reject('No tab to send message: ' + message.type);
      }
      const res = this.registerCallback(message, timeToWaitResponse);
      super.sendMessageToTab(tab, message);
      return res;
    }

    /**
     *
     * @param {object} message to send
     * @param {number} timeToWaitResponse time in ms what we wait response
     * @return {Promise<object>} with response
     */
    sendMessageAndGetResponse(message, timeToWaitResponse) {
      const res = this.registerCallback(message, timeToWaitResponse);
      super.sendMessage(message);
      return res;
    }

    /**
     *
     * @param {object} message to send (to Global - popup or bg)
     * @param {number} timeToWaitResponse time in ms what we wait response
     * @return {Promise<object>} with response
     */
    sendMessageAndGetResponseGlobal(message, timeToWaitResponse = 500) {
      const res = this.registerCallback(message, timeToWaitResponse);
      super.sendMessageGlobal(message);
      return res;
    }
  }
}
