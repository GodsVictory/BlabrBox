function Chat(message) {
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: (window.innerWidth + window.innerHeight) * .15,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
  });
  var container = new PIXI.Sprite();
  container.text = message;
  container.grow = 30;
  container.vx = 0;
  container.vy = 0;
  container.x = window.innerWidth * Math.random();
  container.y = window.innerHeight * Math.random();

  // FORCE PROPER DIMENSIONS
  var dimensionPlaceholder = new PIXI.Text(' ', style);
  container.addChild(dimensionPlaceholder);
  height = container.getBounds().height;
  dimensionPlaceholder.destroy(true);

  // PARSE MESSAGE
  // INSERT EMOTES
  var messageArray = message.split(' ');
  for (var i = 0, len = messageArray.length; i < len; i++) {
    if (typeof gloMemes[messageArray[i]] !== 'undefined') {
      var word = new PIXI.Sprite.fromImage("assets/emotes/global/" + gloMemes[messageArray[i]] + ".png");
      word.scale.x = word.scale.y = style.fontSize * .01;
      word.x = container.getBounds().width;
      word.anchor.set(0, .5);
      word.y = height / 2;
    } else if (typeof subMemes[messageArray[i]] !== 'undefined') {
      var word = new PIXI.Sprite.fromImage("assets/emotes/subscriber/" + subMemes[messageArray[i]] + ".png");
      word.scale.x = word.scale.y = style.fontSize * .01;
      word.x = container.getBounds().width;
      word.anchor.set(0, .5);
      word.y = height / 2;
    } else if (typeof ffzMemes[messageArray[i]] !== 'undefined') {
      var word = new PIXI.Sprite.fromImage("assets/emotes/ffz/" + ffzMemes[messageArray[i]] + ".png");
      word.scale.x = word.scale.y = style.fontSize * .01;
      word.x = container.getBounds().width;
    } else {
      var word = new PIXI.Text(messageArray[i], style);
      word.x = container.getBounds().width;
    }
    container.addChild(word);

    // ADD SPACES IF ADDITIONAL WORD
    if (i + 1 < len) {
      var space = new PIXI.Text(' ', style);
      space.x = container.getBounds().width;
      container.addChild(space);
    }
  }

  // MANUALLY SET ANCHOR TO .5
  var offsetWidth = container.getBounds().width / 2;
  var offsetHeight = container.getBounds().height / 2;
  for (var i = 0, len = container.children.length; i < len; i++) {
    container.children[i].x -= offsetWidth;
    container.children[i].y -= offsetHeight;
  }
  container.scale.x = 0;
  container.scale.y = 0;
  chatContainer.addChild(container);
}