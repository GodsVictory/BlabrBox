function setupClient() {
  var timeout;

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
    if (channel)
      if (channel == 'simulateChat') {
        setInterval(function() {
          handleChat('', '', '000 000');
        }, 500);
        setInterval(function() {
          handleChat('', '', '0000000');
        }, 750);
        setInterval(function() {
          handleChat('', '', Math.round((Math.random() * 100)).toString());
        }, 250);
      } else
        client.join(channel).catch(function(e) {});
    else
      channel = 'Channel...';

    channelInput.text = channel;
    channelInput.grow = true;

    if (channel != 'Channel...')
      timeout = setTimeout(function() {
        channelInput.grow = false;
      }, 1000);

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
            client.join(channel).catch(function(e) {});
            timeout = setTimeout(function() {
              channelInput.grow = false;
            }, 1000);
          }
          channelInput.text = channel;
        }
    }
  });

  client.connect();
}