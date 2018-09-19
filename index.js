import guid from "./guid";
import ChromeMessenger from "./browser-messagers/ChromeMessenger";
import NormalExtensionsMessenger from "./browser-messagers/NormalExtensionsMessenger";
import SafariMessenger from "./browser-messagers/SafariMessenger";

var browserType = "";
if (chrome) {
  browserType = "chrome";
} else if (safari) {
  browserType = "safari";
} else if (browser) {
  browserType = "firefoxOrEdge"
} else {
  throw new Error("web-extension-messenger not support your type of extension");
}

/**
 * type definition
 * @typedef {Object} Implementations
 * @property {object} chrome - Chrome implementations
 * @property {object} safari - Safari implementations
 * @property {object} firefox - Firefox implementations
 * @property {object} edge - Edge implementations
 */
const Implementations = {
  chrome: ChromeMessenger,
  safari: SafariMessenger,
  firefoxOrEdge: NormalExtensionsMessenger,
  "": class NoClass {}
}[browserType];

export default class Messenger extends Implementations{
  constructor() {
    super();
    this.callbacks = [];
    this.responses = {};
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
   * send message to other messengers
   * @param message
   */
  sendMessage(message) {
    super.sendMessage(message);
  }

  /**
   *
   * @param {object} message to send
   * @return {promise} with response
   */
  sendMessageAndGetResponse(message) {
    if (!message.messageId) {
      message['messageId'] = guid();
    }

    return new Promise((resolve, reject) => {
      this.responses[message.messageId] = function (response) {
        resolve(response);
      };

      this.sendMessage(message);
    });
  }
}