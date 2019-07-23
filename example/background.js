import Messenger from "..";

console.log("run background");
const messenger = new Messenger();

function callback(message, tab) {
  console.log("message from some tab", message, tab);

  return {
    yourMessage: message
  };
}

messenger.onMessage(callback);

setTimeout(function () {
  messenger.sendMessageAndGetResponse({
    text: "hello tab!!!"
  }).then(function (message) {
    console.log("response from tabs", message);
  });
}, 2000);

window.messenger = messenger; // for test with dev console
