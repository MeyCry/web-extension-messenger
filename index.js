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
      super.sendMessageToTab(tab, message);
    }

    /**
     * Send message to tab and get promise with response
     * @param {tab} tab
     * @param {object} message
     * @param {number} timeToWaitResponse time in ms what we wait response
     * @return {Promise<object>}
     */
    sendMesssageToTabAndGetResponse(tab, message, timeToWaitResponse = 500) {
      if (!message.messId) {
        message.messId = guid();
      }

      return new Promise((resolve, reject) => {
        var timer = null;
        this.responses[message.messId] = function (response) {
          clearTimeout(timer);
          resolve(response);
        };

        timer = setTimeout(() => {
          delete this.responses[message.messId];
          reject();
        }, timeToWaitResponse);

        this.sendMessageToTab(tab, message);
      });
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
     * send message to content
     * @param {object} message
     */
    sendMessageToContent(message) {
      super.sendMessageToContent(message);
    }

    /**
     * send message to popup or background
     * @param {object} message
     */
    sendMessageGlobal(message) {
      super.sendMessageGlobal(message);
    }

    /**
     *
     * @param {object} message to send
     * @param {number} timeToWaitResponse time in ms what we wait response
     * @return {Promise<object>} with response
     */
    sendMessageAndGetResponse(method, message, timeToWaitResponse = 500) {
      if (!message.messId) {
        message.messId = guid();
      }

      return new Promise((resolve, reject) => {
        var timer = null;
        this.responses[message.messId] = function (response) {
          clearTimeout(timer);
          resolve(response);
        };

        timer = setTimeout(() => {
          delete this.responses[message.messId];
          reject(`To long waiting for response! Wait was: ${timeToWaitResponse}`);
        }, timeToWaitResponse);

        method(message);
      });
    }

    sendMessageGlobalAndGetResponse(message, timeToWaitResponse) {
      this.sendMessageAndGetResponse(this.sendMessageGlobal, message, timeToWaitResponse);
    }

    sendMessageToContentAndGetResponse(message, timeToWaitResponse) {
      this.sendMessageAndGetResponse(this.sendMessageToContent, message, timeToWaitResponse);
    }
  }
}
