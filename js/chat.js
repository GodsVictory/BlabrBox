function Chat(message) {
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: 256,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 1500,
  });
  var chat = new PIXI.Text(message, style);
  chat.anchor.set(.5);
  chat.scale.x = 0;
  chat.scale.y = 0;
  chat.grow = 10;
  chat.z = 1;
  chat.vx = 0;
  chat.vy = 0;
  chat.maxVel = 5;
  chat.x = window.innerWidth * Math.random();
  chat.y = window.innerHeight * Math.random();
  app.stage.addChild(chat);
  return chat;
}

/*function Chat(message) {
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: 128,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 2500,
  });
  var graphic = new PIXI.Graphics();
  graphic.beginFill(0xFFFFFF, 0);
  graphic.drawRect(0, 0, 1, 1);
  graphic.endFill();
  var container = new PIXI.Sprite();
  container.anchor.set(.5);
  container.scale.x = 1;
  container.scale.y = 1;
  container.grow = 32;
  container.z = 0;
  container.px = Math.random();
  container.py = Math.random();
  container.x = window.innerWidth * container.px;
  container.y = window.innerHeight * container.py;
  app.stage.addChild(container);
  var messageArray = message.split(' ');
  var word;
  var lastWidth = 0;
  for (var i = 0, len = messageArray.length; i < len; i++) {
    word = new PIXI.Text(messageArray[i], style);
    //word.anchor.set(.5);
    container.addChild(word);
    word.x = lastWidth + 25;
    lastWidth = word.x + word.width;
  }
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