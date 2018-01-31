function startTicker() {
  // RENDER LOOP
  app.ticker.add(function(delta) {
    if (document.hidden) return;
    document.getElementById('channel').focus();

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    chatContainer.children.sort(depthCompare);

    // INPUT HANDLER
    if (channelInput.grow && channelInput.text.length > 0) {
      if (channelInput.width < app.renderer.width * .45)
        channelInput.scale.x = channelInput.scale.y += growSpeed * 5 * delta;
      else if (channelInput.width > app.renderer.width * .55)
        channelInput.scale.x = channelInput.scale.y -= growSpeed * 5 * delta;
    } else
    if (channelInput.scale.x > 0)
      channelInput.scale.x = channelInput.scale.y -= growSpeed * 3 * delta;
    else
      channelInput.scale.x = channelInput.scale.y = 0;

    growSpeed = (app.renderer.width * app.renderer.height) * .000000075;
    decaySpeed = growSpeed * .005;

    // PROCESS
    var count = chatContainer.children.length;
    for (var message in messages) {
      messages[message].applyGrow(delta, count);
      messages[message].applyVelocity(delta);
      messages[message].slowDown(delta);
      messages[message].collision(delta);
      messages[message].keepInBounds(delta);
      messages[message].checkRemove(delta);
    }
  });
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}