function startTicker() {
  var speed = .05;
  var brakeSpeed = .0075;
  var growSpeed = .02;
  var collisionSpeed = 10;
  var boundarySpeed = 10;

  // RENDER LOOP
  app.ticker.add(function(delta) {
    if (document.hidden) return;

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    chatContainer.children.sort(depthCompare);

    // INPUT HANDLER
    if (channelInput.grow) {
      if (channelInput.width < window.innerWidth * .45)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 1, .05);
      else if (channelInput.width > window.innerWidth * .55)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);
    } else
      channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);

    // GET COUNT
    var count = chatContainer.children.length;

    // PROCESS
    for (var i = chatContainer.children.length - 1; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;
      var width = message.getBounds(true).width;
      var height = message.getBounds(true).height;

      // GROW OR SHRINK
      if (message.grow) {
        if (width < window.innerWidth - 10 && height / 1.7 < window.innerHeight - 10)
          message.scale.x = message.scale.y += growSpeed;
        message.grow--;
      } else {
        if (count / 2 < 10)
          message.scale.x = message.scale.y = lerp(message.scale.x, -.1, '.'.concat(pad(10, 4)));
        else
          message.scale.x = message.scale.y = lerp(message.scale.x, -.1, '.'.concat(pad(Math.round(count / 2), 4)));
      }

      // APPLY VELOCITY
      message.x += message.vx * (speed / scale);
      message.y += message.vy * (speed / scale);

      // SLOW DOWN
      if (inBoundsX(message.x, width) == 0 && inBoundsY(message.y, height) == 0) {
        message.vx = lerp(message.vx, 0, brakeSpeed * scale);
        message.vy = lerp(message.vy, 0, brakeSpeed * scale);
      }
    }
  });

  // PHYSICS LOOP
  setInterval(function() {
    if (document.hidden) return;
    document.getElementById('channel').focus();

    // HANDLE NEW MESSAGES
    if (newChat.length > 0) {
      var newMessage = newChat.shift();
      var exists = false;
      chatContainer.children.find(function(ele) {
        if (ele.text === newMessage) {
          exists = true;
          ele.grow += 60;
        }
      });
      if (!exists) {
        var bad = false;
        if (badwords.some(function(v) {
            return newMessage.indexOf(v) >= 0;
          })) {
          bad = true;
        }
      }
      if (!bad && !exists) {
        setTimeout(function() {
          Chat(newMessage);
        }, delay || 0);
      }
    }

    // APPLY PHYSICS
    for (var i = chatContainer.children.length - 1; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;
      var width = message.getBounds(true).width;
      var height = message.getBounds(true).height;

      // COLLISION
      for (var j = chatContainer.children.length - 1; j >= 0; j--) {
        if (i == j) continue;
        var otherMessage = chatContainer.children[j];
        var otherWidth = otherMessage.getBounds(true).width;
        var otherHeight = otherMessage.getBounds(true).height;
        var otherScale = otherMessage.scale.x + 1;
        var side = collide(message, width, height, otherMessage, otherWidth, otherHeight, scale);
        if (side == 'none') continue;
        if (side == 'top') message.vy -= collisionSpeed / (scale / otherScale);
        else if (side == 'bottom') message.vy += collisionSpeed / (scale / otherScale);
        else if (side == 'left') message.vx -= collisionSpeed / (scale / otherScale);
        else if (side == 'right') message.vx += collisionSpeed / (scale / otherScale);
        break;
      }

      // KEEP IN BOUNDS
      message.vx += inBoundsX(message.x, width) * boundarySpeed * scale;
      message.vy += inBoundsY(message.y, height) * boundarySpeed * scale;

      // REMOVE WHEN SCALE = 0
      if (message.scale.x <= 0 && message.grow < 1)
        message.destroy({
          children: true,
          baseTexture: true
        });
    }
  }, 1000 / 10);
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function depthCompare(a, b) {
  if (a.scale.x < b.scale.x) return -1;
  if (a.scale.x > b.scale.x) return 1;
  return 0;
}

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function inBoundsX(x, width) {
  if (x - width / 2 < 0) return 1;
  else if (x + width / 2 > window.innerWidth) return -1;
  return 0;
}

function inBoundsY(y, height) {
  if (y - height / 3.25 < 0) return 1;
  else if (y + height / 3.25 > window.innerHeight) return -1;
  return 0;
}

function collide(r1, r1w, r1h, r2, r2w, r2h, scale) {
  var dx = r1.x - r2.x;
  var dy = r1.y - r2.y;
  var width = (r1w + r2w) / 2;
  var height = (r1h + r2h) / 3.25; //(scale);
  var crossWidth = width * dy;
  var crossHeight = height * dx;
  var collision = 'none';
  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
    } else {
      collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
    }
  }
  return (collision);
}