var app, chatContainer, channelInput, channel, cursorTimeout, channelTimeout, fontLoaded, loading, style;
var memes = {},
  messages = {},
  badwords = {},
  newChat = [];
var url = new Qurl();
var bg = url.query('bg') || "black";
var delay = url.query('delay');
var length = url.query('length') || 40;
var emoteOnly = url.query('emote_only') || false;
var fps = url.query('fps') || false;
if (emoteOnly == 'true' || emoteOnly == '1') emoteOnly = true;
else emoteOnly = false;
var fontSize = 48;
var scale = parseFloat(url.query('scale') || 1);
var growSpeed = .1;
var decaySpeed = growSpeed * .01;
var growAmount = 30 * scale;
var collisionSpeed = .001;
var boundarySpeed = .01;
var brakeSpeed = .98;
var fpsText;

window.onload = function start() {
  document.body.style.backgroundColor = bg;
  loadFont();
  var waitForLoad = setInterval(function () {
    if (fontLoaded) {
      clearInterval(waitForLoad);
      load();
    }
  }, 100);
}
const loader = PIXI.Loader.shared;

function load() {
  PIXI.settings.GC_MODE = 'manual';
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  app = new PIXI.Application({
    //backgroundColor: 0x000000,
    transparent: true,
    antialias: false,
    position: 'absolute',
    top: 0,
    left: 0,
    crossOrigin: true,
    width: window.innerWidth,
    height: window.innerHeight
  });
  document.body.appendChild(app.view);
  style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: fontSize,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3,
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

  loader.add('emotes', 'assets/emotes.json');
  loader.add('badwords', 'assets/badwords.json');
  loader.load((loader, resources) => {
    memes = resources.emotes.data;
    badwords = resources.badwords.data;
  });
  loader.onComplete.once(() => {
    init();
  });
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

  if (fps) {
    fpsText = new PIXI.Text('', {
      fontFamily: 'Fredoka One',
      fontSize: 32,
      align: 'center',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    });
    fpsText.x = 0;
    fpsText.y = 0;
    app.stage.addChild(fpsText);
  }

  window.onresize = function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    channelInput.x = app.renderer.width / 2;
    channelInput.y = app.renderer.height / 2;
  }

  document.onmousemove = function () {
    document.getElementById('channel').style.cursor = 'default';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(function () {
      document.getElementById('channel').style.cursor = 'none';
    }, 1000);
  }

  document.onclick = function () {
    channelInput.grow = true;
    clearTimeout(channelTimeout);
    if (channel != 'Channel...')
      channelTimeout = setTimeout(function () {
        channelInput.grow = false;
      }, 2000);
  }

  document.ondblclick = function () {
    screenfull.toggle();
  }

  setupClient();
  startTicker();
}