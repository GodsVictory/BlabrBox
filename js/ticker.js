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
      // APPLY VELOCITY
      message.x += message.vx * .15;
      message.y += message.vy * .15;
      // SLOW DOWN
      message.vx = lerp(message.vx, 0, .01 / scale);
      message.vy = lerp(message.vy, 0, .01 / scale);
    }

    for (var i = totalMessages; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;
      var width = 0;
      var height = 0;
      for (var j = 0, len = message.children.length; j < len; j++) {
        width += message.children[j].width * message.scale.x;
        height = message.children[j].height * message.scale.y;
      }

      // GROW OR SHRINK
      if (message.grow) {
        if (width < window.innerWidth - 10 && height < window.innerHeight - 10)
          message.scale.x = message.scale.y += .01;
        message.grow--;
      } else
        message.scale.x = message.scale.y -= '.'.concat(pad(Math.round(count), 4)) * scale;

      // COLLISION
      for (var j = totalMessages; j >= 0; j--) {
        var otherMessage = chatContainer.children[j];
        var otherWidth = 0;
        var otherHeight = 0;
        for (var k = 0, len = otherMessage.children.length; k < len; k++) {
          otherWidth += otherMessage.children[k].width * otherMessage.scale.x;
          otherHeight = otherMessage.children[k].height * otherMessage.scale.y;
        }
        if (message.text == otherMessage.text) continue;
        var side = collide(message, width, height, otherMessage, otherWidth, otherHeight);
        var otherScale = otherMessage.scale.x + 1;
        if (side != 'none') {
          if (side == 'top')
            message.vy -= otherScale / scale;
          else if (side == 'bottom')
            message.vy += otherScale / scale;
          else if (side == 'left')
            message.vx -= otherScale / scale;
          else if (side == 'right')
            message.vx += otherScale / scale;
          break;
        }
      }

      // KEEP IN BOUNDS
      if (message.x - width / 2 < 0) message.vx += scale * 2;
      if (message.x + width / 2 > window.innerWidth) message.vx -= scale * 2;
      if (message.y - height / 3 < 0) message.vy += scale * 2;
      if (message.y + height / 3 > window.innerHeight) message.vy -= scale * 2;

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

function collide(r1, r1w, r1h, r2, r2w, r2h) {
  var dx = r1.x - r2.x;
  var dy = r1.y - r2.y;
  var width = (r1w + r2w) / 2;
  var height = (r1h + r2h) / 2;
  var crossWidth = width * dy;
  var crossHeight = height * dx;
  var collision = 'none';
  //
  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
    } else {
      collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
    }
  }
  return (collision);
}