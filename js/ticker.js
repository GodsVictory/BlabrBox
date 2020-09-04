function startTicker() {
  // RENDER LOOP
  var counter = 0;
  app.ticker.add(function (delta) {
    counter++;
    if (document.hidden) return;
    document.getElementById('channel').focus();

    // SORT MESSAGES SO BIGGEST IS IN FRONT
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

    growSpeed = app.renderer.height / fontSize * .005;
    if (growSpeed < .02) growSpeed = .02;
    decaySpeed = growSpeed * .0015;

    // PROCESS
    var count = chatContainer.children.length;
    for (var message in messages) {
      messages[message].applyGrow(delta, count);
      if (messages[message].checkRemove(delta)) break;
      if (counter % physicsMod == 0)
        messages[message].keepInBounds(delta);
      if (counter % physicsMod == 5)
        messages[message].collision(delta);
      messages[message].applyVelocity(delta);
      messages[message].slowDown(delta);
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
    if (counter == 60) counter = 0;
  });
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}