function Chat(message) {
  style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: (window.innerWidth + window.innerHeight) * .03,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3,
  });
  this.message = message;
  this.container = new PIXI.Sprite();
  this.container.text = message;
  this.grow = 30;
  this.container.vx = 0;
  this.container.vy = 0;
  this.container.x = window.innerWidth * Math.random();
  this.container.y = window.innerHeight * Math.random();
  this.collisionSpeed = 150;
  this.boundarySpeed = 175;
  this.growSpeed = .02;
  this.decaySpeed = .0001;
  this.speed = 25;
  this.brakeSpeed = 15;

  // FORCE PROPER DIMENSIONS
  var dimensionPlaceholder = new PIXI.Text(' ', style);
  this.container.addChild(dimensionPlaceholder);
  height = Math.round(this.container.getBounds().height);

  // PARSE MESSAGE
  // INSERT EMOTES
  var messageArray = message.split(' ');
  var ratio = style.fontSize * .009;
  for (var i = 0, len = messageArray.length; i < len; i++) {
    if (typeof memes[messageArray[i]] !== 'undefined') {
      var meme = memes[messageArray[i]];
      var url;
      if (meme.u == 't')
        url = "https://static-cdn.jtvnw.net/emoticons/v1/" + meme.i + "/3.0";
      else
        url = "assets/emotes/ffz/" + meme.i + ".png";
      var emote = new PIXI.Sprite.fromImage(url);
      emote.width = meme.w * ratio;
      emote.height = meme.h * ratio;
      emote.x = i == 0 ? 0 : this.container.getBounds().width;
      emote.anchor.set(0, .5);
      emote.y = height / 2;
      this.container.addChild(emote);
    } else {
      var word = new PIXI.Text(messageArray[i], style);
      word.x = i == 0 ? 0 : this.container.getBounds().width;
      this.container.addChild(word);
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

Chat.prototype.getScale = function() {
  return this.container.scale.x;
}

Chat.prototype.setScale = function(scale) {
  this.container.scale.x = scale;
  this.container.scale.y = scale;
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
  this.container.vx = vx;
}

Chat.prototype.setVY = function(vy) {
  this.container.vy = vy;
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
  return this.container.getBounds(false).height;
}

Chat.prototype.applyVelocity = function(vx) {
  this.setX(lerp(this.getX(), this.getX() + this.getVX(), (this.speed * .025)));
  this.setY(lerp(this.getY(), this.getY() + this.getVY(), (this.speed * .025)));
}

Chat.prototype.slowDown = function(vx) {
  this.setVX(lerp(this.getVX(), 0, this.brakeSpeed * 0.00075 * (this.getScale() + 1)));
  this.setVY(lerp(this.getVY(), 0, this.brakeSpeed * 0.00075 * (this.getScale() + 1)));
}

Chat.prototype.collision = function() {
  for (var message in messages) {
    if (this.message == message) continue;
    var other = messages[message];
    var side = this.checkCollide(this.getX(), this.getY(), this.getWidth(), this.getHeight(), other.getX(), other.getY(), other.getWidth(),
      other.getHeight());
    if (side == 'none') continue;
    if (side == 'top')
      this.setVY(this.getVY() - (this.collisionSpeed * .01 / ((this.getScale() + 5) / (other.getScale() + 1))));
    else if (side == 'bottom')
      this.setVY(this.getVY() + (this.collisionSpeed * .01 / ((this.getScale() + 5) / (other.getScale() + 1))));
    else if (side == 'left')
      this.setVX(this.getVX() - (this.collisionSpeed * .01 / ((this.getScale() + 5) / (other.getScale() + 1))));
    else if (side == 'right')
      this.setVX(this.getVX() + (this.collisionSpeed * .01 / ((this.getScale() + 5) / (other.getScale() + 1))));
  }
}

Chat.prototype.checkCollide = function(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  var dx = r1x - r2x;
  var dy = r1y - r2y;
  var width = (r1w + r2w) / 2;
  var height = (r1h + r2h) / 3.25;
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

Chat.prototype.keepInBounds = function() {
  this.setVX(this.getVX() + this.inBoundsX() * this.boundarySpeed * .01);
  this.setVY(this.getVY() + this.inBoundsY() * this.boundarySpeed * .01);
}

Chat.prototype.inBoundsX = function(x, width) {
  if (this.getX() - this.getWidth() / 2 < 0) return 1;
  else if (this.getX() + this.getWidth() / 2 > window.innerWidth) return -1;
  return 0;
}

Chat.prototype.inBoundsY = function(y, height) {
  if (this.getY() - this.getHeight() / 3.25 < 0) return 1;
  else if (this.getY() + this.getHeight() / 3.25 > window.innerHeight) return -1;
  return 0;
}

Chat.prototype.addGrow = function(count) {
  this.grow += Math.round(100 / (count / 10 + 1) / (this.getScale() / 5 + 1));
}

Chat.prototype.applyGrow = function(count) {
  if (this.getWidth() > window.innerWidth - 10 || this.getHeight() / 1.7 > window.innerHeight - 10)
    this.grow = 0;
  if (this.grow == 0) {
    if (count < 10)
      this.setScale(this.getScale() - this.decaySpeed * 10);
    else
      this.setScale(this.getScale() - this.decaySpeed * count);
  } else
    this.setScale(this.getScale() + this.growSpeed);
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
