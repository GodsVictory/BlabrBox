function Chat(message) {
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: fontSize,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2
  });
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
  return this.container.getBounds(false).height / 1.75;
}

Chat.prototype.applyVelocity = function(vx) {
  this.setX(lerp(this.getX(), this.getX() + this.getVX(), (speed * .025)));
  this.setY(lerp(this.getY(), this.getY() + this.getVY(), (speed * .025)));
}

Chat.prototype.slowDown = function(vx) {
  this.setVX(lerp(this.getVX(), 0, brakeSpeed * 0.00075)); // * (this.getScale() + 1)));
  this.setVY(lerp(this.getVY(), 0, brakeSpeed * 0.00075)); // * (this.getScale() + 1)));
}

Chat.prototype.collision = function() {
  var thisInfo = {
    x: this.getX(),
    y: this.getY(),
    h: this.getHeight(),
    w: this.getWidth(),
    vx: this.getVX(),
    vy: this.getVY(),
    left: this.getX() - this.getWidth() / 2,
    right: this.getX() + this.getWidth() / 2,
    top: this.getY() - this.getHeight() / 2,
    bottom: this.getY() + this.getHeight() / 2,
    angle: 2 * Math.atan(this.getHeight() / this.getWidth()) * 180 / Math.PI / 2
  };
  var overlap = 0;
  for (var i = chatContainer.children.length - 1; i >= 0; i--) {
    if (this.message == chatContainer.children[i].text) continue;
    var other = messages[chatContainer.children[i].text];
    var otherInfo = {
      x: other.getX(),
      y: other.getY(),
      h: other.getHeight(),
      w: other.getWidth(),
      left: other.getX() - other.getWidth() / 2,
      right: other.getX() + other.getWidth() / 2,
      top: other.getY() - other.getHeight() / 2,
      bottom: other.getY() + other.getHeight() / 2
    };
    if (this.checkCollide(thisInfo, otherInfo)) {
      var degree = Math.atan2(-(otherInfo.y - thisInfo.y), (otherInfo.x - thisInfo.x)) * 180 / Math.PI;
      if (degree < 0) degree += 360;
      if (degree < 360 - thisInfo.angle + overlap && degree > 180 + thisInfo.angle - overlap) // this is getting hit on the bottom
        this.setVY(thisInfo.vy - (collisionSpeed * .01 / (thisInfo.h / otherInfo.h)));
      else if (degree > 0 + thisInfo.angle - overlap && degree < 180 - thisInfo.angle + overlap) // this is getting hit on the top
        this.setVY(thisInfo.vy + (collisionSpeed * .01 / (thisInfo.h / otherInfo.h)));
      if (degree > 180 - thisInfo.angle - overlap && degree < 180 + thisInfo.angle + overlap) // this is getting hit on the left
        this.setVX(thisInfo.vx + (collisionSpeed * .01 / (thisInfo.h / otherInfo.h)));
      else if (degree < 0 + thisInfo.angle + overlap || degree > 360 - thisInfo.angle - overlap) // this is getting hit on the right
        this.setVX(thisInfo.vx - (collisionSpeed * .01 / (thisInfo.h / otherInfo.h)));
      break;
    }
  }
}

Chat.prototype.checkCollide = function(r1, r2) {
  return !(r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top);
}

Chat.prototype.keepInBounds = function() {
  this.setVX(this.getVX() + this.inBoundsX() * boundarySpeed * .01);
  this.setVY(this.getVY() + this.inBoundsY() * boundarySpeed * .01);
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

Chat.prototype.applyGrow = function(count) {
  if (this.getWidth() > app.renderer.width - 10 || this.getHeight() > app.renderer.height - 10)
    this.grow = 0;
  if (this.grow == 0) {
    if (count < 10)
      this.setScale(this.getScale() - decaySpeed * 10);
    else
      this.setScale(this.getScale() - decaySpeed * count);
  } else
    this.setScale(this.getScale() + growSpeed);
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