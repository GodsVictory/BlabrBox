function loadFont() {
  WebFontConfig = {
    google: {
      families: ['Fredoka One']
    },

    active: function() {
      fontLoaded = true;
    }
  };

  (function(d) {
    var wf = d.createElement('script'),
      s = d.scripts[0];
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.async = true;
    s.parentNode.insertBefore(wf, s);
  })(document);
}