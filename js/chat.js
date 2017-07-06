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
    fontSize: (window.innerWidth + window.innerHeight) * .1,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
  });
  var graphic = new PIXI.Graphics();
  graphic.beginFill(0xFFFFFF, 0);
  graphic.drawRect(0, 0, 1, 1);
  graphic.endFill();
  var container = new PIXI.Sprite();
  container.text = message;
  container.anchor.set(.5);
  container.scale.x = 0;
  container.scale.y = 0;
  container.grow = 30;
  container.vx = 0;
  container.vy = 0;
  container.maxVel = 0;
  container.x = window.innerWidth * Math.random();
  container.y = window.innerHeight * Math.random();
  var messageArray = message.split(' ');
  var word;
  var lastWidth = 0;
  var height = 0;
  for (var i = 0, len = messageArray.length; i < len; i++) {
    var emote = false;
    for (var j = 0, gloLen = gloMemes.length; j < gloLen; j++)
      if (messageArray[i] == gloMemes[j].code) {
        emote = gloMemes[j].url;
        break;
      }
    if (emote) {
      word = new PIXI.Sprite.fromImage('http:' + emote);
      container.addChild(word);
      word.scale.x = word.scale.y = style.fontSize * .01;
      word.x = lastWidth;
      lastWidth = word.x + 75 * style.fontSize * .01;
      height = 84 * style.fontSize * .01;
    } else {
      word = new PIXI.Text(messageArray[i], style);
      container.addChild(word);
      word.x = lastWidth;
      lastWidth = word.x + word.width;
      height = word.height > height ? word.height : height;
    }
    if (i + 1 < len) {
      word = new PIXI.Text(' ', style);
      container.addChild(word);
      word.x = lastWidth;
      lastWidth = word.x + word.width;
    }
  }
  for (var i = 0, len = container.children.length; i < len; i++) {
    container.children[i].x -= lastWidth / 2;
    container.children[i].y -= height / 2;
  }
  chatContainer.addChild(container);
  return container;
}