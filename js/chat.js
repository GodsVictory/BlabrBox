function Chat(message) {
  this.message = message;
  this.container = new PIXI.Sprite();
  this.container.text = message;
  this.grow = 30;
  this.container.vx = 0;
  this.container.vy = 0;
  this.container.x = app.renderer.width * Math.random();
  this.container.y = app.renderer.height * Math.random();

  // FORCE PROPER DIMENSIONS
  var dimensionPlaceholder = new PIXI.Text(' ', style);
  this.container.addChild(dimensionPlaceholder);
  height = Math.round(this.container.getBounds().height);

  // PARSE MESSAGE
  // INSERT EMOTES
  var messageArray = message.split(' ');
  for (var i = 0, len = messageArray.length; i < len; i++) {
    if (typeof memes[messageArray[i]] !== 'undefined') {
      var meme = memes[messageArray[i]];
      var url;
      if (meme.u == 't')
        url = "https://static-cdn.jtvnw.net/emoticons/v1/" + meme.i + "/3.0";
      else
        url = "assets/emotes/ffz/" + meme.i + ".png";
      var emote = new PIXI.Sprite.fromImage(url);
      emote.width = height / meme.h * meme.w * .575;
      emote.height = height / meme.h * meme.h * .575;
      if (i > 0)
        emote.x = this.container.getBounds().width;
      emote.anchor.set(0, .5);
      emote.y = height / 2;
      this.container.addChild(emote);
    } else {
      if (!emoteOnly) {
        var word = new PIXI.Text(messageArray[i], style);
        word.x = i == 0 ? 0 : this.container.getBounds().width;
        this.container.addChild(word);
      }
    }
    // ADD SPACES IF ADDITIONAL WORD
    if (i + 1 < len) {
      var space = new PIXI.Text(' ', style);
      space.x = this.container.getBounds().width;
      this.container.addChild(space);
    }
  }

  // MANUALLY SET ANCHOR TO .5
  var offsetWidth = this.container.getBounds().width / 2;
  var offsetHeight = this.container.getBounds().height / 2;
  for (var i = 0, len = this.container.children.length; i < len; i++) {
    this.container.children[i].x -= offsetWidth;
    this.container.children[i].y -= offsetHeight;
  }
  this.container.scale.x = 0;
  this.container.scale.y = 0;

  chatContainer.addChild(this.container);
}

Chat.prototype.setX = function(x) {
  this.container.x = x;
}

Chat.prototype.setY = function(y) {
  this.container.y = y;
}

Chat.prototype.getX = function() {
  return this.container.x;
}

Chat.prototype.getY = function() {
  return this.container.y;
}

Chat.prototype.setVX = function(vx) {
  if (Math.abs(vx) > maxSpeed) {
    if (vx < 0) this.container.vx = -maxSpeed;
    else this.container.vx = maxSpeed;
  } else this.container.vx = +vx.toFixed(2);
}

Chat.prototype.setVY = function(vy) {
  if (Math.abs(vy) > maxSpeed) {
    if (vy < 0) this.container.vy = -maxSpeed;
    else this.container.vy = maxSpeed;
  } else this.container.vy = +vy.toFixed(2);
}

Chat.prototype.getVX = function(vx) {
  return this.container.vx;
}

Chat.prototype.getVY = function(vy) {
  return this.container.vy;
}

Chat.prototype.getWidth = function() {
  return this.container.getBounds(false).width;
}

Chat.prototype.getHeight = function() {
  return this.container.getBounds(false).height / 1.75;
}

Chat.prototype.applyVelocity = function(delta) {
  this.setX(this.getX() + this.getVX() * delta);
  this.setY(this.getY() + this.getVY() * delta);
}

Chat.prototype.slowDown = function(delta) {
  if (this.getVX() < -.05 || this.getVX() > .05) this.setVX(this.getVX() * brakeSpeed);
  else this.setVX(0);
  if (this.getVY() < -.05 || this.getVY() > .05) this.setVY(this.getVY() * brakeSpeed);
  else this.setVY(0);
}

Chat.prototype.collision = function(delta) {
  var thisInfo = {
    x: this.getX(),
    y: this.getY(),
    h: this.getHeight(),
    w: this.getWidth(),
    vx: this.getVX(),
    vy: this.getVY()
  };
  var overlap = 0;
  for (var i = chatContainer.children.length - 1; i >= 0; i--) {
    if (this.message == chatContainer.children[i].text) continue;
    var other = messages[chatContainer.children[i].text];
    if (typeof other === 'undefined') continue;
    var otherInfo = {
      x: other.getX(),
      y: other.getY(),
      h: other.getHeight(),
      w: other.getWidth()
    };

    var side = this.checkCollide(thisInfo, otherInfo);
    if (side == 'none') continue;
    var weight = collisionSpeed * ((otherInfo.h * otherInfo.w) / (thisInfo.h * thisInfo.w));
    if (side == 'top')
      this.setVY(thisInfo.vy + weight);
    else if (side == 'bottom')
      this.setVY(thisInfo.vy - weight);
    else if (side == 'left')
      this.setVX(thisInfo.vx + weight);
    else if (side == 'right')
      this.setVX(thisInfo.vx - weight);
    break;
  }
}

Chat.prototype.checkCollide = function(r1, r2) {
  var dx = r1.x - r2.x;
  var dy = r1.y - r2.y;
  var width = (r1.w + r2.w) / 2;
  var height = (r1.h + r2.h) / 2;
  var crossWidth = width * dy;
  var crossHeight = height * dx;
  var collision = 'none';
  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      if (crossWidth > (-crossHeight)) collision = 'top';
      else collision = 'right';
    } else {
      if (crossWidth > -(crossHeight)) collision = 'left';
      else collision = 'bottom';
    }
  }
  return (collision);
}

Chat.prototype.keepInBounds = function(delta) {
  this.setVX(this.getVX() + this.inBoundsX() * boundarySpeed);
  this.setVY(this.getVY() + this.inBoundsY() * boundarySpeed);
}

Chat.prototype.inBoundsX = function(x, width) {
  if (this.getX() - this.getWidth() / 2 < 0) return 1;
  else if (this.getX() + this.getWidth() / 2 > app.renderer.width) return -1;
  return 0;
}

Chat.prototype.inBoundsY = function(y, height) {
  if (this.getY() - this.getHeight() / 2 < 0) return 1;
  else if (this.getY() + this.getHeight() / 2 > app.renderer.height) return -1;
  return 0;
}

Chat.prototype.getScale = function() {
  return this.container.scale.x;
}

Chat.prototype.setScale = function(scale) {
  this.container.scale.x = scale;
  this.container.scale.y = scale;
}

Chat.prototype.addGrow = function(count) {
  this.grow += Math.round(100 / (count / 100 + 1) / (this.getScale() / 5 + 1));
}

Chat.prototype.applyGrow = function(delta, count) {
  if (this.getWidth() > app.renderer.width - 10 || this.getHeight() > app.renderer.height - 10)
    this.grow = 0;
  if (this.grow == 0) {
    if (count < 10)
      this.setScale(this.getScale() - (decaySpeed * 10 + (this.getHeight() * .0001)) * delta);
    else
      this.setScale(this.getScale() - (decaySpeed * count + (this.getHeight() * .0001)) * delta);
  } else
    this.setScale(this.getScale() + growSpeed * delta);
  if (this.grow > 0)
    this.grow--;
}

Chat.prototype.checkRemove = function() {
  if (this.getScale() <= .01) {
    delete messages[this.message];
    this.container.destroy({
      children: true,
      baseTexture: true
    });
  }
}
