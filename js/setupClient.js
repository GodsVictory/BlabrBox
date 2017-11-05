function setupClient() {
  var clientOptions = {
      connection: {
        reconnect: true,
        secure: true
      },
    },
    client = new tmi.client(clientOptions);
  client.on('message', handleChat);
  client.on('connected', function() {

    channel = Qurl.create().query('c');
    if (channel) {
      if (channel == 'simulateChat') {
        handleChat('', '', 'Kappa asdf');
        handleChat('', '', 'BibleThump');
        setInterval(function() {
          handleChat('', '', 'Clayton Sucks');
        }, 500);
        setInterval(function() {
          handleChat('', '', 'Kappa');
        }, 500);
        setInterval(function() {
          handleChat('', '', Math.round((Math.random() * 100)).toString());
        }, 150);
      } else
        client.join(channel).catch(function(e) {});
      document.getElementById('channel').value = channel;
    } else
      channel = 'Channel...';

    channelInput.text = channel;
    channelInput.grow = true;

    if (channel != 'Channel...')
      channelTimeout = setTimeout(function() {
        channelInput.grow = false;
      }, 2000);

    document.getElementById('channel').oninput = function() {
      clearTimeout(channelTimeout);
      channelInput.grow = true;
      client.part(channel);

      channel = document.getElementById('channel').value;
      Qurl.create().query('c', channel);

      if (!channel)
        channel = 'Channel...'
      else {
        channelTimeout = setTimeout(function() {
          client.join(channel).catch(function(e) {});
          channelInput.grow = false;
        }, 2000);
      }
      channelInput.text = channel;
    }
    /* SAVING FOR NOW WHILE TESTING NEW VERSION
        window.onkeydown = function(evt) {
          if (evt.key.length == 1 || evt.key == 'Backspace')
            if (evt.key.match(/[a-z0-9-_ ]/i)) {
              clearTimeout(timeout);
              channelInput.grow = true;
              client.part(channel);
              if (channel == 'Channel...')
                channel = '';
              if (evt.key == 'Backspace')
                channel = channel.substring(0, channel.length - 1);
              else if (evt.key.match(/[a-z0-9-_ ]/i))
                channel += evt.key;
              Qurl.create().query('c', channel);
              if (!channel)
                channel = 'Channel...'
              else {
                timeout = setTimeout(function() {
                  client.join(channel).catch(function(e) {});
                  channelInput.grow = false;
                }, 2000);
              }
              channelInput.text = channel;
            }
        }*/
  });

  client.connect();
}
