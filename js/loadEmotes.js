function loadEmotes() {
  var gloMemesGet, getGloMemes = new XMLHttpRequest();
  getGloMemes.onreadystatechange = function() {
    if (getGloMemes.readyState == 4 && getGloMemes.status == 200) {
      gloMemesGet = JSON.parse(getGloMemes.responseText).emotes;
      gloMemesKeys = Object.keys(gloMemesGet);
      for (var i = 0, len = gloMemesKeys.length; i < len; i++)
        gloMemes[i] = {
          code: gloMemesKeys[i],
          url: "http://static-cdn.jtvnw.net/emoticons/v1/" + gloMemesGet[gloMemesKeys[i]].image_id + "/3.0"
        };
      gloMemes.sort(function(a, b) {
        return b.code.length - a.code.length || a.code.localeCompare(b.code);
      });
      for (var i = 0, len = gloMemes.length; i < len; i++)
        new PIXI.Sprite.fromImage(gloMemes[i].url);
      emotesLoaded = true;
    }
  };
  getGloMemes.open("GET", "https://twitchemotes.com/api_cache/v2/global.json", true);
  getGloMemes.send();
}