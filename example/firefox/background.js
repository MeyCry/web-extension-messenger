/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


console.log("run background");

const messenger = new _index__WEBPACK_IMPORTED_MODULE_0__["default"]();

function callback(message, tab) {
  console.log("message from some tab", message, tab);

  if (message.messId) { // send response
    messenger.sendMessage({
      messId: message.messId,
      yourMessage: message
    });
  }
}

// messenger.sendMessageToTab(tab, message);

messenger.onMessage(callback);

setTimeout(function () {
  messenger.sendMessageAndGetResponse({
    text: "hello tab!!!"
  }).then(function (message) {
    console.log("response from tabs", message);
  });
}, 2000);

window.messenger = messenger; // for test with dev console

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Messenger; });
/* harmony import */ var _guid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _browser_messagers_ChromeMessenger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _browser_messagers_NormalExtensionsMessenger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _browser_messagers_SafariMessenger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);





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
 * @typedef {Object} Implementations
 * @property {object} chrome - Chrome implementations
 * @property {object} safari - Safari implementations
 * @property {object} firefoxOrEdge - Firefox and Edge implementations
 */
const Implementations = {
  chrome: _browser_messagers_ChromeMessenger__WEBPACK_IMPORTED_MODULE_1__["default"],
  safari: _browser_messagers_SafariMessenger__WEBPACK_IMPORTED_MODULE_3__["default"],
  firefoxOrEdge: _browser_messagers_NormalExtensionsMessenger__WEBPACK_IMPORTED_MODULE_2__["default"],
  "": class NoClass {}
}[browserType];

class Messenger extends Implementations {
  constructor() {
    super();
    this.callbacks = [];
    this.responses = {};
  }

  /**
   * Send message to active tab
   * @param {object}
   * @return {void}
   */
  sendMessageToTab(tab, message) {
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
   * send message to other messengers
   * @param {object} message
   */
  sendMessage(message) {
    super.sendMessage(message);
  }

  /**
   *
   * @param {object} message to send
   * @return {Promise} with response
   */
  sendMessageAndGetResponse(message) {
    if (!message.messId) {
      message.messId = Object(_guid__WEBPACK_IMPORTED_MODULE_0__["default"])();
    }

    return new Promise((resolve, reject) => {
      this.responses[message.messId] = function (response) {
        resolve(response);
      };

      this.sendMessage(message);
    });
  }
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return guid; });
/**
 * @example 0d7f
 * @return {string}
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * Create random guid
 * @example 0d7f40c5-d03b-d5df-ae8f-a7255a94095a
 * @return {string}
 */
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChromeMessenger; });
class ChromeMessenger {
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender) => {
      const messId = message.messId;

      this.callbacks.forEach(callback => {
        if (chrome.tabs) { // background
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
   * Find active tab and send message to it
   * @param {object} message 
   */
  sendMessageToTab(tab, message) {
    chrome.tabs.sendMessage(tab.id, message)
  }

  /**
   * Send to all tabs or to background
   * @param {Object} message - Message that will be sent
   * @returns {void}
   */
  sendMessage(message) {
    if (chrome.tabs) { // background
      chrome.tabs.query({windowType: "normal"}, function (tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, message);
        });
      });
    } else { // client
      chrome.runtime.sendMessage(message);
    }
  }
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NormalExtensionsMessenger; });
/**
 * https://browserext.github.io/browserext/
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 *
 */
class NormalExtensionsMessenger {
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

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SafariMessenger; });
class SafariMessenger {
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

/***/ })
/******/ ]);