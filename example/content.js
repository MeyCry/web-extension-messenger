import Messenger from "../index";

console.log("run content");

setTimeout(function () {
  const messenger = new Messenger();

  function callback(message) {
    console.log("message from background", message);
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