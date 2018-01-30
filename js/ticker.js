var growSpeed = 0;
var decaySpeed = 0;
var collisionSpeed = 50;
var boundarySpeed = 200;
var speed = 50;
var brakeSpeed = 25;

function startTicker() {
  // RENDER LOOP
  app.ticker.add(function(delta) {
    if (document.hidden) return;

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    chatContainer.children.sort(depthCompare);

    // INPUT HANDLER
    if (channelInput.grow) {
      if (channelInput.width < app.renderer.width * .45)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 100, .001);
      else if (channelInput.width > app.renderer.width * .55)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);
    } else
      channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);

    // PROCESS
    var count = chatContainer.children.length;
    for (var message in messages) {
      messages[message].applyGrow(count);
      messages[message].applyVelocity();
      messages[message].slowDown();
    }
  });

  // PHYSICS LOOP
  setInterval(function() {
    if (document.hidden) return;
    document.getElementById('channel').focus();

    growSpeed = (app.renderer.width * app.renderer.height) * .00000005;
    decaySpeed = growSpeed * .004;

    // APPLY PHYSICS
    for (var message in messages) {
      messages[message].collision();
      messages[message].keepInBounds();
      messages[message].checkRemove();
    }

    // HANDLE NEW MESSAGES
    if (newChat.length > 0) {
      var newMessage = newChat.shift();
      if (typeof messages[newMessage] !== 'undefined') {
        messages[newMessage].addGrow(chatContainer.children.length);
      } else {
        if (!badwords.some(function(v) {
            return newMessage.indexOf(v) >= 0;
          }))
          setTimeout(function() {
            messages[newMessage] = new Chat(newMessage);
          }, delay || 0);
      }
    }
  }, 1000 / 10);
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}