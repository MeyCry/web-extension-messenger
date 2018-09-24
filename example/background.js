import Messenger from "../index";

console.log("run background");

const messenger = new Messenger();

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