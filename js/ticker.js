function startTicker() {
  app.ticker.add(function(delta) {
    if (channelInput.grow) {
      if (channelInput.width < window.innerWidth * .45)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 1, .05);
      else if (channelInput.width > window.innerWidth * .55)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);
    } else
      channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);

    chatContainer.children.sort(depthCompare);
    var totalMessages = chatContainer.children.length - 1;
    var count = 0;
    for (var i = totalMessages; i >= 0; i--)
      count += chatContainer.children[i].scale.x + 1;

    for (var i = totalMessages; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;

      // GROW OR SHRINK
      if (message.grow) {
        if (message.width < window.innerWidth - 10 && message.height < window.innerHeight - 10)
          message.scale.x = message.scale.y += .01;
        message.grow--;
      } else
        message.scale.x = message.scale.y -= '.'.concat(pad(Math.round(count), 5)) * scale;

      // COLLISION
      for (var j = totalMessages; j >= 0; j--) {
        var otherMessage = chatContainer.children[j];
        if (message.text == otherMessage.text) continue;
        if (collides(message, otherMessage)) {
          message.vx += (-1 + message.x / otherMessage.x) * otherMessage.scale.x / scale;
          message.vy += (-1 + message.y / otherMessage.y) * otherMessage.scale.y / scale;
        }
      }

      // KEEP IN BOUNDS
      if (message.x - message.width / 2 < 0) message.vx += scale * .25;
      if (message.x + message.width / 2 > window.innerWidth) message.vx -= scale * .25;
      if (message.y - message.height / 3 < 0) message.vy += scale * .25;
      if (message.y + message.height / 3 > window.innerHeight) message.vy -= scale * .25;

      // SET NEW MAX VELOCITY
      message.maxVel = 10 / scale;

      // RESET VELOCITY TO MAX
      message.vx = Math.max(-message.maxVel, Math.min(message.vx, message.maxVel));
      message.vy = Math.max(-message.maxVel, Math.min(message.vy, message.maxVel));

      // APPLY VELOCITY
      message.x += message.vx;
      message.y += message.vy;

      // SLOW DOWN
      message.vx = lerp(message.vx, 0, .01 / scale);
      message.vy = lerp(message.vy, 0, .01 / scale);

      // REMOVE WHEN SCALE = 0
      if (message.scale.x <= 0) {
        message.destroy();
        totalMessages = chatContainer.children.length - 1;
      }
    }
  });
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}

function collides(a, b) {
  var divideWidthBy = 2;
  var divideHeightBy = 3;
  return a.x - a.width / divideWidthBy < b.x + b.width / divideWidthBy &&
    a.x + a.width / divideWidthBy > b.x - b.width / divideWidthBy &&
    a.y - a.height / divideHeightBy < b.y + b.height / divideHeightBy &&
    a.y + a.height / divideHeightBy > b.y - b.height / divideHeightBy;
}

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}