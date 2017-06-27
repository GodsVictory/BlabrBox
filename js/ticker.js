function startTicker() {
  var count = 0;
  app.ticker.add(function(delta) {
    app.stage.children.sort(depthCompare);

    // APPLY VELOCITY
    count = 0;
    for (var i = messages.length - 1; i >= 0; i--) {
      messages[i].x = lerp(messages[i].x, messages[i].x + messages[i].vx, .05);
      messages[i].y = lerp(messages[i].y, messages[i].y + messages[i].vy, .05);
      count += messages[i].scale.x + 1;
      5
    }

    for (var i = messages.length - 1; i >= 0; i--) {
      var scale = messages[i].scale.x + 1;

      // GROW OR SHRINK
      if (messages[i].grow) {
        if (messages[i].width < window.innerWidth - 10 && messages[i].height < window.innerHeight - 10) {
          messages[i].scale.x += (window.innerWidth + window.innerHeight) * .00001;
          messages[i].scale.y += (window.innerWidth + window.innerHeight) * .00001;
        }
        messages[i].grow--;
      } else {
        messages[i].scale.x -= '.'.concat(pad(Math.round(count), 5)) * scale;
        messages[i].scale.y -= '.'.concat(pad(Math.round(count), 5)) * scale;
      }

      // SLOW DOWN
      messages[i].vx = lerp(messages[i].vx, 0, .005 / scale);
      messages[i].vy = lerp(messages[i].vy, 0, .005 / scale);

      // COLLISION
      for (var j = messages.length - 1; j >= 0; j--) {
        if (messages[i].text == messages[j].text) continue;
        if (collides(messages[i], messages[j])) {
          if (messages[i].x <= messages[j].x) // hit right
            messages[i].vx += (-1 + messages[i].x / messages[j].x) * (messages[j].scale.x + 1) / scale * 50;
          else if (messages[i].x > messages[j].x) // hit left
            messages[i].vx += (-1 + messages[i].x / messages[j].x) * (messages[j].scale.x + 1) / scale * 50;
          if (messages[i].y <= messages[j].y) // hit bottom
            messages[i].vy += (-1 + messages[i].y / messages[j].y) * (messages[j].scale.x + 1) / scale * 50;
          else if (messages[i].y > messages[j].y) // hit top
            messages[i].vy += (-1 + messages[i].y / messages[j].y) * (messages[j].scale.x + 1) / scale * 50;
        }
      }

      // KEEP IN BOUNDS
      if (messages[i].x - messages[i].width / 2 < 0)
        messages[i].vx += 10 * scale;
      if (messages[i].x + messages[i].width / 2 > window.innerWidth)
        messages[i].vx -= 10 * scale;
      if (messages[i].y - messages[i].height / 2 < 0)
        messages[i].vy += 10 * scale;
      if (messages[i].y + messages[i].height / 2 > window.innerHeight)
        messages[i].vy -= 10 * scale;

      // SET NEW MAX VELOCITY
      messages[i].maxVel = 50 / scale;

      // RESET VELOCITY TO MAX
      if (messages[i].vx > messages[i].maxVel)
        messages[i].vx = messages[i].maxVel;
      else if (messages[i].vx < -messages[i].maxVel)
        messages[i].vx = -messages[i].maxVel;
      if (messages[i].vy > messages[i].maxVel)
        messages[i].vy = messages[i].maxVel;
      else if (messages[i].vy < -messages[i].maxVel)
        messages[i].vy = -messages[i].maxVel;

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