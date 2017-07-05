function Chat(message) {
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
}
/*
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
  chatContainer.addChild(container);
  var messageArray = message.split(' ');
  var word;
  var lastWidth = 0;
  for (var i = 0, len = messageArray.length; i < len; i++) {
    word = new PIXI.Text(messageArray[i], style);
    word.anchor.set(.5);
    container.addChild(word);
    word.x = lastWidth + 25;
    lastWidth = word.x + word.width;
  }
  for (var i = 0, len = container.children.length; i < len; i++) {
    container.children[i].x -= lastWidth / 2;
  }
  container.cWidth = lastWidth;
  container.cHeight = word.height;
  return container;
}*/
/*var chat = new PIXI.Text(message, style);
  chat.anchor.set(.5);
  chat.scale.x = 0;
  chat.scale.y = 0;
  chat.grow = 32;
  chat.z = 0;
  chat.px = Math.random();
  chat.py = Math.random();
  chat.x = window.innerWidth * chat.px;
  chat.y = window.innerHeight * chat.py;
  app.stage.addChild(chat);
  return container;
}*/