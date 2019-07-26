import Messenger from "..";

console.log("run content");
const messenger = new Messenger();

setTimeout(function () {
  function callback(message) {
    console.log("message from background", message);

    return {
      title: document.title,
    };
  }

  messenger.onMessage(callback);

  messenger.sendMessageAndGetResponse({
    text: "hello"
  }).then(function (message) {
    console.log("response from background", message);
  });

  setTimeout(function () {
    messenger.sendMessage({
      superId: 42,
      megaDescription: "word"
    });

    messenger.offMessage(callback);
  }, 2000);
}, 2000);

window.messenger = messenger; // for test with dev console
