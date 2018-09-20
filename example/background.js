import Messenger from "../index";

const messenger = new Messenger();

function callback(message) {
  console.log("message from some tab", message);

  if (message.messageId) { // send response
    messenger.sendMessage({
      messageId: message.messageId,
      yourMessage: message
    });
  }
}

messenger.onMessage(callback);

setTimeout(function () {
  messenger.sendMessageAndGetResponse({
    text: "hello tab!!!"
  }).then(function (message) {
    console.log("response from tabs", message);
  });
}, 2000);