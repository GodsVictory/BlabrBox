#!/bin/bash
#
# This Script will download global, subscriber, and ffz emote JSON files and format them for BlabrBox
#

mkdir -p ~/tmp/assets/emotes/ffz
cd ~/tmp || exit
rm -f assets/*.json assets/*.csv
touch assets/global.json
touch assets/global.csv
touch assets/subscriber.csv
touch assets/ffz.json
touch assets/ffz.csv
touch assets/emotes.json

curl -s 'https://twitchemotes.com/api_cache/v3/global.json' | jq '.[]|{(.code):(.id)}' | grep -v '{\|}' |\
  awk '{print $1 "," "\"https://static-cdn.jtvnw.net/emoticons/v1/"$2"/3.0\","}' | sed 's/":,"/","/g' >> assets/global.json

curl -s 'https://twitchemotes.com/api_cache/v3/subscriber.json' | jq '.[]|.emotes|.[]|{(.code):(.id)}' | grep -v '{\|}' |\
  awk '{print $1 "," "\"https://static-cdn.jtvnw.net/emoticons/v1/"$2"/3.0\","}' | sed 's/":,"/","/g' |\
  awk -F',' '{print $1 "," $2 ",112,112"}' | sed 's/"//g' >> assets/subscriber.csv

curl -s 'http://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc' | jq '.emoticons|.[]|{(.name):(.id)}' |\
 grep -v '{\|}' | awk '{print $1 "," "\"assets/emotes/ffz/"$2".png\","}' | sed 's/":,"/","/g' >> assets/ffz.json

 curl -s 'http://api.frankerfacez.com/v1/emoticons?per_page=200&sort=count-desc' | jq '.emoticons|.[]|.id' |\
 cat assets/ffz.json | cut -d, -f1 | sed 's/"//g' |
  while read line
  do
    ((
      [ -f ${line}.png ] ||\
        wget -qN "http://cdn.frankerfacez.com/emoticon/${line}/4" -O assets/emotes/ffz/${line}.png ||\
        wget -qN "http://cdn.frankerfacez.com/emoticon/${line}/2" -O assets/emotes/ffz/${line}.png ||\
        wget -qN "http://cdn.frankerfacez.com/emoticon/${line}/1" -O assets/emotes/ffz/${line}.png
    ) & )
  done



cat assets/global.json | while read line
do
  ((
    code=$(echo $line | cut -d'"' -f2)
    url=$(echo $line | cut -d'"' -f4)
    size=$(php -r "print_r(getimagesize('$(echo $url| cut -d'"' -f2)')[3]);" | awk -F'"' '{print $2","$4}')
    echo $code,$url,$size >> assets/global.csv
  ) & )
  while [[ $(pgrep -c php) -ge 50 ]];do sleep .25;done
done

cat assets/ffz.json | while read line
do
  ((
    code=$(echo $line | cut -d'"' -f2)
    url=$(echo $line | cut -d'"' -f4)
    size=$(php -r "print_r(getimagesize('$(echo $url| cut -d'"' -f2)')[3]);" | awk -F'"' '{print $2","$4}')
    echo $code,$url,$size >> assets/ffz.csv
  ) & )
  while [[ $(pgrep -c php) -ge 50 ]];do sleep .25;done
done

for f in assets/emotes/ffz/*.png
do
  [[ $(grep ${f%.*} assets/ffz.csv) ]] || rm -f $f
done

echo '{' >> assets/emotes.json
cat assets/*.csv | grep -Ev "^$" | jq --slurp --raw-input --raw-output \
    'split("\n") | .[1:] | map(split(",")) |
        map({"code": .[0],
             "url": .[1],
             "width": .[2],
             "height": .[3]})' | jq '.[]|{(.code):{("url"):(.url), ("width"):(.width), ("height"):(.height)}}' | grep -v '^{\|^}' | sed 's/}$/},/g' | sed -e '$s/,//g' >> assets/emotes.json
echo '}' >> assets/emotes.json
jq -c . < assets/emotes.json > assets/emotes.min.json
rm -f assets/*.csv assets/global.json assets/ffz.json assets/emotes.json
