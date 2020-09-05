function startTicker() {
  // RENDER LOOP
  var counter = 0;
  var lastTime = Date.now(),
    timeSinceLastFrame = 0,
    lastCount = 0;
  var lastPhysicsTime = 0;
  var lastChatTime = 0;
  app.ticker.add(function (delta) {
    var now = Date.now();
    if (fps) {
      timeSinceLastFrame = now - lastTime;
      if (timeSinceLastFrame >= 1000) {
        var curFPS = counter - lastCount;
        fpsText.text = Math.round(curFPS);
        lastTime = now;
        lastCount = counter;
      }
    }
    counter++;
    if (document.hidden) return;
    document.getElementById('channel').focus();


    // INPUT HANDLER
    if (channelInput.grow && channelInput.text.length > 0) {
      app.stage.removeChild(channelInput);
      app.stage.addChild(channelInput);
      if (channelInput.width < app.renderer.width * .45)
        channelInput.scale.x = channelInput.scale.y += growSpeed * delta;
      else if (channelInput.width > app.renderer.width * .55)
        channelInput.scale.x = channelInput.scale.y -= growSpeed * delta;
    } else
    if (channelInput.scale.x > 0)
      channelInput.scale.x = channelInput.scale.y -= growSpeed * delta;
    else
      channelInput.scale.x = channelInput.scale.y = 0;

    // PROCESS
    var count = chatContainer.children.length;
    let physicsApplied = false;
    for (var message in messages) {
      messages[message].applyGrow(delta, count);
      if (messages[message].checkRemove()) break;
      if (now - lastPhysicsTime >= 100) {
        // SORT MESSAGES SO BIGGEST IS IN FRONT
        chatContainer.children.sort(depthCompare);
        messages[message].setDimensions();
        messages[message].keepInBounds();
        messages[message].collision();
        physicsApplied = true;
      }
      messages[message].applyVelocity(delta);
      messages[message].slowDown();
    }
    if (physicsApplied) lastPhysicsTime = now;

    if (now - lastChatTime >= 50) {
      lastChatTime = now;
      if (newChat.length > 0) {
        var message = newChat.shift();
        if (message.length <= length)
          if (message in messages) {
            messages[message].addGrow();
          } else {
            if (!badwords.words.some(function (v) {
                return message.toLowerCase().indexOf(v.toLowerCase()) >= 0;
              }))
              messages[message] = new Chat(message);
          }
      }
    }
  });
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}