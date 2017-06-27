function startTicker() {
  app.ticker.add(function(delta) {
    if (channelInput.grow && channelInput.width < window.innerWidth * .5 && channelInput.height < window.innerHeight * .5) {
      channelInput.scale.x += .05;
      channelInput.scale.y += .05;
    }
    if (channelInput.grow && (channelInput.width > window.innerWidth * .5 || channelInput.height > window.innerHeight * .5)) {
      channelInput.scale.x -= .05;
      channelInput.scale.y -= .05;
    }
    if (!channelInput.grow && channelInput.scale.x > 0) {
      channelInput.scale.x -= .01 / channelInput.scale.x;
      channelInput.scale.y -= .01 / channelInput.scale.y;
      if (channelInput.scale.x < 0) {
        channelInput.scale.x = 0;
        channelInput.scale.y = 0;
      }
    }
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
        if (message.width < window.innerWidth - 10 && message.height < window.innerHeight - 10) {
          message.scale.x += (window.innerWidth + window.innerHeight) * .0000025;
          message.scale.y += (window.innerWidth + window.innerHeight) * .0000025;
        }
        message.grow--;
      } else {
        message.scale.x -= '.'.concat(pad(Math.round(count), 5)) * scale;
        message.scale.y -= '.'.concat(pad(Math.round(count), 5)) * scale;
      }

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
      if (message.x - message.width / 2 < 0) message.vx += scale;
      if (message.x + message.width / 2 > window.innerWidth) message.vx -= scale;
      if (message.y - message.height / 3 < 0) message.vy += scale;
      if (message.y + message.height / 3 > window.innerHeight) message.vy -= scale;

      // SET NEW MAX VELOCITY
      message.maxVel = 10 / scale;

      // RESET VELOCITY TO MAX
      if (message.vx > message.maxVel) message.vx = message.maxVel;
      else if (message.vx < -message.maxVel) message.vx = -message.maxVel;
      if (message.vy > message.maxVel) message.vy = message.maxVel;
      else if (message.vy < -message.maxVel) message.vy = -message.maxVel;

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