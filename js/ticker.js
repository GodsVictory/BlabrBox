function startTicker() {
  //var lastFrame = 0;
  var speed = .1; // 60fps default .1 / 30fps .5
  var brakeSpeed = .01; // 60fps default .075 / 30fps .15
  var growSpeed = .005; // 60fps default .01 / 30 fps .02
  var collisionSpeed = .075; // 60fps default .075 / 30fps .15
  var boundarySpeed = 20; // 60fps default 5 / 30fps 10

  app.ticker.add(function(delta) {
    if (document.hidden) return;
    //if (Date.now() - lastFrame < 1000 / 30) return;
    //lastFrame = Date.now();
    document.getElementById('channel').focus();
    // INPUT HANDLER
    if (channelInput.grow) {
      if (channelInput.width < window.innerWidth * .45)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 1, .05);
      else if (channelInput.width > window.innerWidth * .55)
        channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);
    } else
      channelInput.scale.x = channelInput.scale.y = lerp(channelInput.scale.x, 0, .05);

    var count = 0;
    for (var i = chatContainer.children.length - 1; i >= 0; i--)
      count += chatContainer.children[i].scale.x + 1;

    for (var i = chatContainer.children.length - 1; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;
      var width = message.getBounds(true).width;
      var height = message.getBounds(true).height;

      // GROW OR SHRINK
      if (message.grow) {
        if (width < window.innerWidth - 10 && height < window.innerHeight - 10)
          message.scale.x = message.scale.y += growSpeed;
        message.grow--;
      } else
        message.scale.x = message.scale.y -= '.'.concat(pad(Math.round(count * 2), 5)) * scale * 2;

      // APPLY VELOCITY
      message.x += message.vx * speed * delta;
      message.y += message.vy * speed * delta;

      // SLOW DOWN
      message.vx = lerp(message.vx, 0, brakeSpeed / scale);
      message.vy = lerp(message.vy, 0, brakeSpeed / scale);
    }
  });

  setInterval(function() {
    if (document.hidden) return;

    // SORT MESSAGES SO BIGGEST IS IN FRONT
    chatContainer.children.sort(depthCompare);

    // APPLY PHYSICS
    for (var i = chatContainer.children.length - 1; i >= 0; i--) {
      var message = chatContainer.children[i];
      var scale = message.scale.x + 1;
      var width = message.getBounds(true).width;
      var height = message.getBounds(true).height;

      // COLLISION
      for (var j = chatContainer.children.length - 1; j >= 0; j--) {
        var otherMessage = chatContainer.children[j];
        if (message.text == otherMessage.text) continue;
        var otherWidth = otherMessage.getBounds(true).width;
        var otherHeight = otherMessage.getBounds(true).height;
        var side = collide(message, width, height, otherMessage, otherWidth, otherHeight, scale);
        if (side != 'none') {
          var otherScale = otherMessage.scale.x + 1;
          if (side == 'top')
            message.vy -= otherScale / (scale * collisionSpeed);
          else if (side == 'bottom')
            message.vy += otherScale / (scale * collisionSpeed);
          else if (side == 'left')
            message.vx -= otherScale / (scale * collisionSpeed);
          else if (side == 'right')
            message.vx += otherScale / (scale * collisionSpeed);
          break;
        }
      }

      // KEEP IN BOUNDS
      if (message.x - width / 2 < 0) message.vx += scale * boundarySpeed;
      if (message.x + width / 2 > window.innerWidth) message.vx -= scale * boundarySpeed;
      if (message.y - height / 3 < 0) message.vy += scale * boundarySpeed;
      if (message.y + height / 3 > window.innerHeight) message.vy -= scale * boundarySpeed;

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

function collide(r1, r1w, r1h, r2, r2w, r2h, scale) {
  var dx = r1.x - r2.x;
  var dy = r1.y - r2.y;
  var width = (r1w + r2w) / 2;
  var height = (r1h + r2h) / 2.5; //(scale);
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