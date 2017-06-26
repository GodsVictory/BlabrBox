function startTicker() {
  var count = 0;
  app.ticker.add(function(delta) {
    app.stage.children.sort(depthCompare);

    // APPLY VELOCITY
    count = 0;
    for (var i = messages.length - 1; i >= 0; i--) {
      messages[i].x = lerp(messages[i].x, messages[i].x + messages[i].vx, .1);
      messages[i].y = lerp(messages[i].y, messages[i].y + messages[i].vy, .1);
      count += messages[i].z;
    }

    for (var i = messages.length - 1; i >= 0; i--) {

      // GROW OR SHRINK
      if (messages[i].grow) {
        if (messages[i].width < window.innerWidth - 10 && messages[i].height < window.innerHeight - 10) {
          messages[i].scale.x += .02; // (window.innerWidth * window.innerHeight);// * .00000001;
          messages[i].scale.y += .02; // (window.innerWidth * window.innerHeight);// * .00000001;
        }
        messages[i].grow--;
      } else {
        messages[i].scale.x -= '.'.concat(pad(count, 5));
        messages[i].scale.y -= '.'.concat(pad(count, 5));
      }

      // COLLISION
      for (var j = messages.length - 1; j >= 0; j--) {
        if (messages[i].text == messages[j].text) continue;
        if (collides(messages[i], messages[j])) {
          if (messages[i].x <= messages[j].x) // move left
            messages[i].vx += Math.abs(messages[j].scale.x / messages[i].scale.x + (messages[j].vx + messages[i].vx)) * (-1 + messages[i].x / messages[j].x);
          else if (messages[i].x > messages[j].x) // move right
            messages[i].vx += Math.abs(messages[j].scale.x / messages[i].scale.x + (messages[j].vx + messages[i].vx)) * (-1 + messages[i].x / messages[j].x);
          if (messages[i].y <= messages[j].y) // move up
            messages[i].vy += Math.abs(messages[j].scale.y / messages[i].scale.y + (messages[j].vy + messages[i].vy)) * (-1 + messages[i].y / messages[j].y);
          else if (messages[i].y > messages[j].y) // move down
            messages[i].vy += Math.abs(messages[j].scale.y / messages[i].scale.y + (messages[j].vy + messages[i].vy)) * (-1 + messages[i].y / messages[j].y);
        }
      }

      // SET NEW MAX VELOCITY
      messages[i].maxVel = 10 / messages[i].scale.x;

      // RESET VELOCITY TO MAX
      if (messages[i].vx > messages[i].maxVel)
        messages[i].vx = messages[i].maxVel;
      else if (messages[i].vx < -messages[i].maxVel)
        messages[i].vx = -messages[i].maxVel;
      if (messages[i].vy > messages[i].maxVel)
        messages[i].vy = messages[i].maxVel;
      else if (messages[i].vy < -messages[i].maxVel)
        messages[i].vy = -messages[i].maxVel;

      // KEEP IN BOUNDS
      if (messages[i].x - messages[i].width / 2 < 0)
        messages[i].vx += 5 * (messages[i].scale.x + 1);
      if (messages[i].x + messages[i].width / 2 > window.innerWidth)
        messages[i].vx -= 5 * (messages[i].scale.x + 1);
      if (messages[i].y - messages[i].height / 2 < 0)
        messages[i].vy += 5 * (messages[i].scale.y + 1);
      if (messages[i].y + messages[i].height / 2 > window.innerHeight)
        messages[i].vy -= 5 * (messages[i].scale.y + 1);

      // SLOW DOWN
      messages[i].vx = lerp(messages[i].vx, 0, .01);
      messages[i].vy = lerp(messages[i].vy, 0, .01);

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