Web extension messenger
=======================

A small wrapper of the Browser API for organizing communication between background and content js scripts. 

`npm i -S web-extension-messenger`

client.js

```$xslt

import Messenger from "web-extension-messenger";

setTimeout(function () {
  const messenger = new Messenger();

  function callback(message) {
    console.log("message from background", message);
  }

  messenger.onMessage(callback);

  messenger.sendMessageGlobalAndGetResponse({
    text: "hello"
  }).then(function (message) {
    console.log("response from background", message);
  });

  setTimeout(function () {
    messenger.sendMessageGlobal({
      superId: 42,
      megaDescription: "word"
    });

    messenger.offMessage(callback);
  }, 2000);
}, 2000);

```

background.js (same as for extension popup)

```$xslt

import Messenger from "web-extension-messenger";

const messenger = new Messenger();

function callback(message) {
  console.log("message from some tab", message);

  if (message.messageId) { // send response
    messenger.sendMessageToContent({
      messageId: message.messageId,
      yourMessage: message
    });
  }
}

messenger.sendMessageGlobal({ // message to popup
  yourMessage: 'Hello!'
});

messenger.onMessage(callback);

setTimeout(function () {
  messenger.sendMessageToContentAndGetResponse({
    text: "hello tab!!!"
  }).then(function (message) {
    console.log("response from tabs", message);
  });
}, 2000);


```