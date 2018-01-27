var app;
var chatContainer;
var channelInput;
var channel = '';
var cursorTimeout;
var channelTimeout
var memes = {};
var fontLoaded = false;
var delay = Qurl.create().query('d');
var length = Qurl.create().query('l') || 40;
var newChat = [];
var loading;

window.onload = function start() {
  loadFont();
  var waitForLoad = setInterval(function() {
    if (fontLoaded) {
      clearInterval(waitForLoad);
      load();
    }
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
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: (window.innerWidth + window.innerHeight) * .025,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
  });
  loading = new PIXI.Text("LOADING", style);
  loading.anchor.set(.5);
  loading.grow = false;
  loading.maxScale = 1;
  loading.x = window.innerWidth / 2;
  loading.y = window.innerHeight / 2;
  app.stage.addChild(loading);

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
  var style = new PIXI.TextStyle({
    fontFamily: 'Fredoka One',
    fontSize: (window.innerWidth + window.innerHeight) * .1,
    align: 'center',
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5,
  });
  channelInput = new PIXI.Text(channel, style);
  channelInput.anchor.set(.5);
  channelInput.scale.x = 0;
  channelInput.scale.y = 0;
  channelInput.grow = false;
  channelInput.maxScale = 1;
  channelInput.x = window.innerWidth / 2;
  channelInput.y = window.innerHeight / 2;
  app.stage.addChild(channelInput);
  chatContainer = new PIXI.Container();
  app.stage.addChild(chatContainer);

  window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    channelInput.x = window.innerWidth / 2;
    channelInput.y = window.innerHeight / 2;
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

var badwords = ['2g1c', '2 girls 1 cup', 'acrotomophilia', 'alabama hot pocket', 'alaskan pipeline', 'anal', 'anilingus', 'anus', 'apeshit', 'arsehole', 'ass', 'asshole', 'assmunch', 'auto erotic', 'autoerotic', 'babeland', 'baby batter', 'baby juice', 'ball gag', 'ball gravy', 'ball kicking', 'ball licking', 'ball sack', 'ball sucking', 'bangbros', 'bareback', 'barely legal', 'barenaked', 'bastard', 'bastardo', 'bastinado', 'bbw', 'bdsm', 'beaner', 'beaners', 'beaver cleaver', 'beaver lips', 'bestiality', 'big black', 'big breasts', 'big knockers', 'big tits', 'bimbos', 'birdlock', 'bitch', 'bitches', 'black cock', 'blonde action', 'blonde on blonde action', 'blowjob', 'blow job', 'blow your load', 'blue waffle', 'blumpkin', 'bollocks', 'bondage', 'boner', 'boob', 'boobs', 'booty call', 'brown showers', 'brunette action', 'bukkake', 'bulldyke', 'bullet vibe', 'bullshit', 'bung hole', 'bunghole', 'busty', 'butt', 'buttcheeks', 'butthole', 'camel toe', 'camgirl', 'camslut', 'camwhore', 'carpet muncher', 'carpetmuncher', 'chocolate rosebuds', 'circlejerk', 'cleveland steamer', 'clit', 'clitoris', 'clover clamps', 'clusterfuck', 'cock', 'cocks', 'coprolagnia', 'coprophilia', 'cornhole', 'coon', 'coons', 'creampie', 'cum', 'cumming', 'cunnilingus', 'cunt', 'darkie', 'date rape', 'daterape', 'deep throat', 'deepthroat', 'dendrophilia', 'dick', 'dildo', 'dingleberry', 'dingleberries', 'dirty pillows', 'dirty sanchez', 'doggie style', 'doggiestyle', 'doggy style', 'doggystyle', 'dog style', 'dolcett', 'domination', 'dominatrix', 'dommes', 'donkey punch', 'double dong', 'double penetration', 'dp action', 'dry hump', 'dvda', 'eat my ass', 'ecchi', 'ejaculation', 'erotic', 'erotism', 'escort', 'eunuch', 'faggot', 'fecal', 'felch', 'fellatio', 'feltch', 'female squirting', 'femdom', 'figging', 'fingerbang', 'fingering', 'fisting', 'foot fetish', 'footjob', 'frotting', 'fuck', 'fuck buttons', 'fuckin', 'fucking', 'fucktards', 'fudge packer', 'fudgepacker', 'futanari', 'gang bang', 'gay sex', 'genitals', 'giant cock', 'girl on', 'girl on top', 'girls gone wild', 'goatcx', 'goatse', 'god damn', 'gokkun', 'golden shower', 'goodpoop', 'goo girl', 'goregasm', 'grope', 'group sex', 'g-spot', 'guro', 'hand job', 'handjob', 'hard core', 'hardcore', 'hentai', 'homoerotic', 'honkey', 'hooker', 'hot carl', 'hot chick', 'how to kill', 'how to murder', 'huge fat', 'humping', 'incest', 'intercourse', 'jack off', 'jail bait', 'jailbait', 'jelly donut', 'jerk off', 'jigaboo', 'jiggaboo', 'jiggerboo', 'jizz', 'juggs', 'kike', 'kinbaku', 'kinkster', 'kinky', 'knobbing', 'leather restraint', 'leather straight jacket', 'lemon party', 'lolita', 'lovemaking', 'make me come', 'male squirting', 'masturbate', 'menage a trois', 'milf', 'missionary position', 'motherfucker', 'mound of venus', 'mr hands', 'muff diver', 'muffdiving', 'nambla', 'nawashi', 'negro', 'neonazi', 'nigga', 'nigger', 'nig nog', 'nimphomania', 'nipple', 'nipples', 'nsfw images', 'nude', 'nudity', 'nympho', 'nymphomania', 'octopussy', 'omorashi', 'one cup two girls', 'one guy one jar', 'orgasm', 'orgy', 'paedophile', 'paki', 'panties', 'panty', 'pedobear', 'pedophile', 'pegging', 'penis', 'phone sex', 'piece of shit', 'pissing', 'piss pig', 'pisspig', 'playboy', 'pleasure chest', 'pole smoker', 'ponyplay', 'poof', 'poon', 'poontang', 'punany', 'poop chute', 'poopchute', 'porn', 'porno', 'pornography', 'prince albert piercing', 'pthc', 'pubes', 'pussy', 'queaf', 'queef', 'quim', 'raghead', 'raging boner', 'rape', 'raping', 'rapist', 'rectum', 'reverse cowgirl', 'rimjob', 'rimming', 'rosy palm', 'rosy palm and her 5 sisters', 'rusty trombone', 'sadism', 'santorum', 'scat', 'schlong', 'scissoring', 'semen', 'sex', 'sexo', 'sexy', 'shaved beaver', 'shaved pussy', 'shemale', 'shibari', 'shit', 'shitblimp', 'shitty', 'shota', 'shrimping', 'skeet', 'slanteye', 'slut', 's&m', 'smut', 'snatch', 'snowballing', 'sodomize', 'sodomy', 'spic', 'splooge', 'splooge moose', 'spooge', 'spread legs', 'spunk', 'strap on', 'strapon', 'strappado', 'strip club', 'style doggy', 'suck', 'sucks', 'suicide girls', 'sultry women', 'swastika', 'swinger', 'tainted love', 'taste my', 'tea bagging', 'threesome', 'throating', 'tied up', 'tight white', 'tit', 'tits', 'titties', 'titty', 'tongue in a', 'topless', 'tosser', 'towelhead', 'tranny', 'tribadism', 'tub girl', 'tubgirl', 'tushy', 'twat', 'twink', 'twinkie', 'two girls one cup', 'undressing', 'upskirt', 'urethra play', 'urophilia', 'vagina', 'venus mound', 'vibrator', 'violet wand', 'vorarephilia', 'voyeur', 'vulva', 'wank', 'wetback', 'wet dream', 'white power', 'wrapping men', 'wrinkled starfish', 'xx', 'xxx', 'yaoi', 'yellow showers', 'yiffy', 'zoophilia', '🖕'];

/* get ffz emotes:
curl -so ffz.json 'http://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc'
cat ffz.json |\
  jq '.emoticons|.[]|.id' |\
  while read line;do [ -f ${line}.png ] || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/4" -O ${line}.png || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/2" -O ${line}.png || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/1" -O ${line}.png;done

get twitch global emotes:
curl -so global.json 'https://twitchemotes.com/api_cache/v3/global.json'
cat global.json |\
  jq '.[]|.id' |\
  while read line;do [ -f ${line}.png ] || { while [[ $(pgrep -c wget) -ge 50 ]];do sleep .25;done;{wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/3.0" -O ${line}.png || wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/2.0" -O ${line}.png || wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/1.0" -O ${line}.png} & };done

get twitch subscriber emotes:
curl -so subscriber.json 'https://twitchemotes.com/api_cache/v3/subscriber.json'
cat subscriber.json |\
  jq '.[]|.emotes|.[]|.id' |\
  while read line;do [ -f ${line}.png ] || { while [[ $(pgrep -c wget) -ge 50 ]];do sleep .25;done;{wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/3.0" -O ${line}.png || wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/2.0" -O ${line}.png || wget -q "http://static-cdn.jtvnw.net/emoticons/v1/${line}/1.0" -O ${line}.png} & };done
*/
// cat ffz.json | jq '.emoticons|.[]|{name:.name,urls:(.urls[.urls|keys[-1]])}'
/*
rm -rf ~/tmp
mkdir ~/tmp
cd ~/tmp || exit
echo '{' > emotes.json
curl -s 'https://twitchemotes.com/api_cache/v3/global.json' | jq '.[]|{(.code):(.id)}' | grep -v '{\|}' | awk '{print $1 "\"https://static-cdn.jtvnw.net/emoticons/v1/"$2"/3.0\","}' >> emotes.json
curl -s 'https://twitchemotes.com/api_cache/v3/subscriber.json' | jq '.[]|.emotes|.[]|{(.code):(.id)}' | grep -v '{\|}' | awk '{print $1 "\"https://static-cdn.jtvnw.net/emoticons/v1/"$2"/3.0\","}' >> emotes.json
rm -rf emotes;mkdir -p emotes/ffz;curl -s 'http://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc' | jq '.emoticons|.[]|.id' | while read line;do [ -f ${line}.png ] || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/4" -O emotes/ffz/${line}.png || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/2" -O emotes/ffz/${line}.png || wget -q "http://cdn.frankerfacez.com/emoticon/${line}/1" -O emotes/ffz/${line}.png;done
curl -s 'http://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc' | jq '.emoticons|.[]|{(.name):(.id)}' | grep -v '{\|}' | awk '{print $1 "\"assets/emotes/ffz/"$2".png\","}' >> emotes.json
sed '$ s/,//g' emotes.json -i
echo '}' >> emotes.json
jq -c . < emotes.json > emotes.min.json && rm -f emotes.json

*/