var app;

window.onload = function start() {
  loadFont();
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: 0x000000,
    antialias: true,
    position: 'absolute',
    top: 0,
    left: 0
  });
  document.body.appendChild(app.view);

  window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  document.onvisibilitychange = function() {
    if (!document.hidden)
      app.start();
    else
      app.stop();
  }
}

function init() {
  setupClient();
  startTicker();
}