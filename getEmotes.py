#!/usr/bin/python3
import json, requests
out = {}

#emotes = [{"id":1,"regex":"\\:-?\\)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/1/1.0"}},{"id":2,"regex":"\\:-?\\(","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/2/1.0"}},{"id":3,"regex":"\\:-?D","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/3/1.0"}},{"id":4,"regex":"\\\u0026gt\\;\\(","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/4/1.0"}},{"id":5,"regex":"\\:-?[z|Z|\\|]","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/5/1.0"}},{"id":6,"regex":"[oO](_|\\.)[oO]","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/6/1.0"}},{"id":7,"regex":"B-?\\)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/7/1.0"}},{"id":8,"regex":"\\:-?(o|O)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/8/1.0"}},{"id":9,"regex":"\\\u0026lt\\;3","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/9/1.0"}},{"id":10,"regex":"\\:-?[\\\\/]","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/10/1.0"}},{"id":11,"regex":"\\;-?\\)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/11/1.0"}},{"id":12,"regex":"\\:-?(p|P)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/12/1.0"}},{"id":13,"regex":"\\;-?(p|P)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/13/1.0"}},{"id":14,"regex":"R-?\\)","images":{"emoticon_set":0,"height":18,"width":24,"url":"https://static-cdn.jtvnw.net/emoticons/v1/14/1.0"}}]

h = {'Client-ID': 'qhiutlo0k7m9dd5ovtqgy3ii087gbe', 'Accept': 'application/vnd.twitchtv.v5+json'}
r = requests.get('https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0', headers=h)
emotes = r.json()['emoticon_sets']['0']

for e in emotes:
  if not e['code'] in out:
    out[e['code']] = {'i': e['id']}

h = {'Client-ID': 'qhiutlo0k7m9dd5ovtqgy3ii087gbe', 'Accept': 'application/vnd.twitchtv.v5+json'}
r = requests.get('https://api.twitch.tv/kraken/chat/emoticons', headers=h)
emotes = r.json()['emoticons']

for e in emotes:
  if not e['regex'] in out and e['id'] < 15:
    out[e['regex']] = {'i': e['id']}
  if e['regex'] in out:
    if e['images']['height'] != 28:
      out[e['regex']]['h'] = e['images']['height']
    if e['images']['width'] != 28:
      out[e['regex']]['w'] = e['images']['width']

h = {'Accept': 'application/json'}
r = requests.get('https://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc')
emotes = r.json()['emoticons']

for e in emotes:
  if not e['name'] in out:
    for i in range(9,0,-1):
      if str(i) in e['urls']:
        image_int = str(i)
        break
    out[e['name']] = {'i': e['id'], 'u': 'https:' + e['urls'][image_int]}
    if e['height'] != 28:
      out[e['name']]['h'] = e['height']
    if e['width'] != 28:
      out[e['name']]['w'] = e['width']
'''
h = {'Accept': 'application/json'}
r = requests.get('https://api.betterttv.net/3/emotes/shared/top?limit=100')
emotes = r.json()

for e in emotes:
  if not e['emote']['code'] in out:
    out[e['emote']['code']] = {'u': 'https://cdn.betterttv.net/emote/' + e['emote']['id'] + '/3x'}
    out[e['emote']['code']]['imageType'] = e['emote']['imageType']

for e in out:
  if 'u' in out[e]:
    r = requests.get(out[e]['u'])
  else:
    r = requests.get("https://static-cdn.jtvnw.net/emoticons/v1/" + out[e]['i'] + "/3.0")
  if 'imageType' in out[e]:
    with open("emotes/"+e+"."+out[e]['imageType'], 'wb') as f:
      f.write(r.content)
  else:
    with open("emotes/"+e+".png", 'wb') as f:
      f.write(r.content)  
'''

with open('emotes.json', 'w') as f:
  json.dump(out, f)



