import guid from "./guid";
import ChromeMessenger from "./browser-messagers/ChromeMessenger";
import NormalExtensionsMessenger from "./browser-messagers/NormalExtensionsMessenger";
import SafariMessenger from "./browser-messagers/SafariMessenger";

var chrome = window.chrome || false;
var safari = window.safari || false;
var browser = window.browser || false;

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
 * @typedef {object} Implementations
 * @property {object} chrome - Chrome implementations
 * @property {object} safari - Safari implementations
 * @property {object} firefoxOrEdge - Firefox and Edge implementations
 */
const Implementations = {
  chrome: ChromeMessenger,
  safari: SafariMessenger,
  firefoxOrEdge: NormalExtensionsMessenger,
  "": class NoClass {}
}[browserType];

export default class Messenger extends Implementations {
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
   * send message to other messengers
   * @param {object} message
   */
  sendMessage(message) {
    super.sendMessage(message);
  }

  /**
   *
   * @param {object} message to send
   * @param {number} timeToWaitResponse time in ms what we wait response
   * @return {Promise<object>} with response
   */
  sendMessageAndGetResponse(message, timeToWaitResponse = 500) {
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

      this.sendMessage(message);
    });
  }
}
