function loadEmotes() {
  var gloMemesRaw, getGlowMemes = new XMLHttpRequest();
  getGlowMemes.onreadystatechange = function() {
    if (getGlowMemes.readyState == 4 && getGlowMemes.status == 200) {
      gloMemesRaw = JSON.parse(getGlowMemes.responseText);
      for (var key in gloMemesRaw)
        gloMemes[key] = gloMemesRaw[key].id;
    }
  };
  getGlowMemes.open("GET", "assets/global.json", true);
  getGlowMemes.send();

  var subMemesRaw, getSubMemes = new XMLHttpRequest();
  getSubMemes.onreadystatechange = function() {
    if (getSubMemes.readyState == 4 && getSubMemes.status == 200) {
      subMemesRaw = JSON.parse(getSubMemes.responseText);
      for (var key in subMemesRaw)
        for (var i = 0, len = subMemesRaw[key].emotes.length; i < len; i++)
          subMemes[subMemesRaw[key].emotes[i].code] = subMemesRaw[key].emotes[i].id;
      emotesLoaded = true;
    }
  };
  getSubMemes.open("GET", "assets/subscriber.json", true);
  getSubMemes.send();

  var ffzMemesRaw, getFfzMemes = new XMLHttpRequest();
  getFfzMemes.onreadystatechange = function() {
    if (getFfzMemes.readyState == 4 && getFfzMemes.status == 200) {
      ffzMemesRaw = JSON.parse(getFfzMemes.responseText).emoticons;
      for (var i = 0, len = ffzMemesRaw.length; i < len; i++) {
        ffzMemes[ffzMemesRaw[i].name] = {
          id: ffzMemesRaw[i].id,
          height: ffzMemesRaw[i].height,
          width: ffzMemesRaw[i].width
        }
      }
    }
  };
  getFfzMemes.open("GET", "assets/emotes/ffz/ffz.json", true);
  getFfzMemes.send();
}