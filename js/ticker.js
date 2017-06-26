function startTicker() {
  app.ticker.add(function(delta) {
    app.stage.children.sort(depthCompare);

    // COLLISION
    for (var i = messages.length - 1; i >= 0; i--) {
      for (var j = messages.length - 1; j >= 0; j--) {
        if (i == j)
          continue;
        if (checkCollision(messages[i], messages[j])) {
          if (messages[i].x <= messages[j].x) {
            messages[i].px -= .01 * messages[j].z;
            messages[j].px += .01 * messages[i].z;
          } else if (messages[i].x > messages[j].x) {
            messages[i].px += .01 * messages[j].z;
            messages[j].px -= .01 * messages[i].z;
          }
          if (messages[i].y <= messages[j].y) {
            messages[i].py -= .01 * messages[j].z;
            messages[j].py += .01 * messages[i].z;
          } else if (messages[i].y > messages[j].y) {
            messages[i].py += .01 * messages[j].z;
            messages[j].py -= .01 * messages[i].z;
          }
        }
      }

      // GROW OR SHRINK
      if (messages[i].grow) {
        if (messages[i].width < window.innerWidth - 10 && messages[i].height < window.innerHeight - 10) {
          messages[i].scale.x += (window.innerWidth + window.innerHeight) * .000005;
          messages[i].scale.y += (window.innerWidth + window.innerHeight) * .000005;
        }
        messages[i].grow--;
      } else {
        var mag = messages.length / messages[i].scale.x / 100000;
        messages[i].scale.x = lerp(messages[i].scale.x, -.1, mag);
        messages[i].scale.y = lerp(messages[i].scale.y, -.1, mag);
      }

      // STAY IN WINDOW VIEW
      if (messages[i].x - messages[i].width / 2 < 0)
        messages[i].px = messages[i].px >= 1 ? 1 : messages[i].px + .025;
      if (messages[i].x + messages[i].width / 2 > window.innerWidth)
        messages[i].px = messages[i].px <= 0 ? 0 : messages[i].px - .025;
      if (messages[i].y - messages[i].height / 2 < 0)
        messages[i].py = messages[i].py >= 1 ? 1 : messages[i].py + .025;
      if (messages[i].y + messages[i].height / 2 > window.innerHeight)
        messages[i].py = messages[i].py <= 0 ? 0 : messages[i].py - .025;

      // KEEP MOVING TOWARDS SET COORDINATES
      messages[i].x = lerp(messages[i].x, window.innerWidth * messages[i].px, .025);
      messages[i].y = lerp(messages[i].y, window.innerHeight * messages[i].py, .025);

      // REMOVE WHEN SCALE = 0
      if (messages[i].scale.x <= 0) {
        messages[i].destroy();
        messages.splice(i, 1);
      }
    }
  });
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function depthCompare(a, b) {
  if (a.z < b.z) return -1;
  if (a.z > b.z) return 1;
  return 0;
}

function checkCollision(message1, message2) {
  var divideBy = 3;
  return message1.x - message1.width / divideBy < message2.x + message2.width / divideBy &&
    message1.x + message1.width / divideBy > message2.x - message2.width / divideBy &&
    message1.y - message1.height / divideBy < message2.y + message2.height / divideBy &&
    message1.y + message1.height / divideBy > message2.y - message2.height / divideBy;
}