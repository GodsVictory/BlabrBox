function loadEmotes() {
  var gloMemesRaw, getGlowMemes = new XMLHttpRequest();
  getGlowMemes.onreadystatechange = function() {
    if (getGlowMemes.readyState == 4 && getGlowMemes.status == 200) {
      gloMemesRaw = JSON.parse(getGlowMemes.responseText);
      for (var key in gloMemesRaw)
        gloMemes[key] = gloMemesRaw[key].id;
    }
  };
  getGlowMemes.open("GET", "assets/global.json", true); //"https://twitchemotes.com/api_cache/v2/global.json", true);
  getGlowMemes.send();

  var subMemesRaw, getSubMemes = new XMLHttpRequest();
  getSubMemes.onreadystatechange = function() {
    if (getSubMemes.readyState == 4 && getSubMemes.status == 200) {
      subMemesRaw = JSON.parse(getSubMemes.responseText);
      for (var key in subMemesRaw)
        for (var i = 0, len = subMemesRaw[key].emotes.length; i < len; i++)
          subMemes[subMemesRaw[key].emotes[i].code] = subMemesRaw[key].emotes[i].id;
    }
  };
  getSubMemes.open("GET", "assets/subscriber.json", true); //"https://twitchemotes.com/api_cache/v2/global.json", true);
  getSubMemes.send();

  emotesLoaded = true;
}