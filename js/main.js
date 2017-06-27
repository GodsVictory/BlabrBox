var app;
var chatContainer;
var channelInput;
var channel = '';

window.onload = function start() {
  loadFont();

}

function init() {
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: 0x000000,
    antialias: true,
    position: 'absolute',
    top: 0,
    left: 0
  });
  document.body.appendChild(app.view);
  chatContainer = new PIXI.Container();
  app.stage.addChild(chatContainer);

  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: 128,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
  });
  channelInput = new PIXI.Text(channel, style);
  channelInput.anchor.set(.5);
  channelInput.x = window.innerWidth / 2;
  channelInput.y = window.innerHeight / 2;
  app.stage.addChild(channelInput);

  window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    channelInput.x = window.innerWidth / 2;
    channelInput.y = window.innerHeight / 2;
  }

  document.onvisibilitychange = function() {
    if (!document.hidden)
      app.start();
    else
      app.stop();
  }

  setupClient();
  startTicker();
}