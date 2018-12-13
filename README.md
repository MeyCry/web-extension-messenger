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

  messenger.sendMessageAndGetResponse({
    text: "hello"
  }).then(function (message) {
    console.log("response from background", message);
  });
  
  messenger.sendMessageAndGetResponseGlobal({
    text: "hello Global!"
  }).then(function (message) {
    console.log("response from background", message);
  });

  setTimeout(function () {
    messenger.sendMessage({
      superId: 42,
      megaDescription: "word"
    });
    
    messenger.sendMessageGlobal({
      superId: 43,
      megaDescription: "global word"
    });

    messenger.offMessage(callback);
  }, 2000);
}, 2000);

```

background.js

```$xslt

import Messenger from "web-extension-messenger";

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

messenger.sendMessageGlobal({
  messageId: message.messageId,
  yourMessage: 'Hello Global'
});

setTimeout(function () {
  messenger.sendMessageAndGetResponse({
    text: "hello tab!!!"
  }).then(function (message) {
    console.log("response from tabs", message);
  });
}, 2000);


```