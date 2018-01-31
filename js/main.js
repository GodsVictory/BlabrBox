var app, chatContainer, channelInput, channel, cursorTimeout, channelTimeout, fontLoaded, loading, style;
var memes = {},
  messages = {};
var delay = Qurl.create().query('d');
var length = Qurl.create().query('l') || 40;
var growSpeed = 0;
var decaySpeed = 0;
var collisionSpeed = .05;
var boundarySpeed = 0.167;
var maxSpeed = 10;
var brakeSpeed = .98;
var fontSize = 36;

window.onload = function start() {
  loadFont();
  var waitForLoad = setInterval(function() {
    if (fontLoaded) {
      clearInterval(waitForLoad);
      load();
    } else console.log('asdf');
  }, 100);
}
const loader = PIXI.loader;

function load() {
  PIXI.settings.GC_MODE = 'manual';
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: 0x000000,
    antialias: false,
    position: 'absolute',
    top: 0,
    left: 0,
    crossOrigin: true
  });
  document.body.appendChild(app.view);
  style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: fontSize,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 2,
  });
  loading = new PIXI.Text("LOADING", style);
  loading.anchor.set(.5);
  var iWidth = loading.getBounds().width;
  var iHeight = loading.getBounds().height;
  loading.x = app.renderer.width / 2;
  loading.y = app.renderer.height / 2;
  app.stage.addChild(loading);
  loading.width = app.renderer.width * .45;
  loading.height = app.renderer.width * .45 / iWidth * iHeight;

  loader.add('emotes', 'assets/emotes.min.json');
  loader.once('complete', function(loader, resources) {
    memes = resources.emotes.data;
    init();
  }).load();
}

function init() {
  loading.destroy({
    children: true,
    baseTexture: true
  });
  channelInput = new PIXI.Text(channel, style);
  channelInput.anchor.set(.5);
  channelInput.scale.x = 0;
  channelInput.scale.y = 0;
  channelInput.grow = false;
  channelInput.x = app.renderer.width / 2;
  channelInput.y = app.renderer.height / 2;
  app.stage.addChild(channelInput);
  chatContainer = new PIXI.Container();
  app.stage.addChild(chatContainer);

  window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    channelInput.x = app.renderer.width / 2;
    channelInput.y = app.renderer.height / 2;
  }

  document.onmousemove = function() {
    document.getElementById('channel').style.cursor = 'default';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(function() {
      document.getElementById('channel').style.cursor = 'none';
    }, 1000);
  }

  document.onclick = function() {
    channelInput.grow = true;
    clearTimeout(channelTimeout);
    if (channel != 'Channel...')
      channelTimeout = setTimeout(function() {
        channelInput.grow = false;
      }, 2000);
  }

  document.ondblclick = function() {
    screenfull.toggle();
  }

  setupClient();
  startTicker();
}