function startTicker() {
  // RENDER LOOP
  var counter = 0;
  var lastTime = Date.now(),
    timeSinceLastFrame = 0,
    lastCount = 0;
  app.ticker.add(function (delta) {
    if (fps) {
      var now = Date.now();
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

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    if (counter % 30 == 0)
      chatContainer.children.sort(depthCompare);

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
    for (var message in messages) {
      messages[message].applyGrow(delta, count);
      if (messages[message].checkRemove()) break;
      messages[message].keepInBounds();
      messages[message].collision();
      messages[message].applyVelocity(delta);
      messages[message].slowDown();
    }


    if (counter % 5 == 0)
      if (newChat.length > 0) {
        var message = newChat.shift();
        if (message in messages) {
          messages[message].addGrow();
        } else {
          if (!badwords.words.some(function (v) {
              return message.toLowerCase().indexOf(v.toLowerCase()) >= 0;
            }))
            messages[message] = new Chat(message);
        }
      }
  });
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}