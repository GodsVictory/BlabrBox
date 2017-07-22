/*function Chat(message) {
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: (window.innerWidth + window.innerHeight) * .1,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 10,
    wordWrap: true,
    wordWrapWidth: 1500,
  });
  var chat = new PIXI.Text(message, style);
  chat.anchor.set(.5);
  chat.scale.x = 0;
  chat.scale.y = 0;
  chat.grow = 30;
  chat.vx = 0;
  chat.vy = 0;
  chat.maxVel = 0;
  chat.x = window.innerWidth * Math.random();
  chat.y = window.innerHeight * Math.random();
  chatContainer.addChild(chat);
  return chat;
}*/

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

  // PARSE MESSAGE
  var messageArray = message.split(' ');
  for (var i = 0, len = messageArray.length; i < len; i++) {
    var emote = false;
    for (var j = 0, gloLen = gloMemes.length; j < gloLen; j++)
      if (messageArray[i] == gloMemes[j].code) {
        emote = gloMemes[j].url;
        break;
      }
    if (emote) {
      var word = new PIXI.Sprite.fromImage(emote);
      word.scale.x = word.scale.y = style.fontSize * .01;
      word.anchor.set(0, .5);
      word.x = container.getBounds().width;
      word.y = container.getBounds().height / 2;
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