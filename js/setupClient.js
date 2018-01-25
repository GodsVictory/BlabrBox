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
        setInterval(function() {
          handleChat('', '', 'Kappa Kappa Kappa monkaS a BibleThump asdf asdf asdf asdf asdf asdf asdf asdf asdf '.concat(Math.round((Math.random() * 100)).toString()));
        }, 150);
        setInterval(function() {
          handleChat('', '', 'Kappa');
        }, 100);
        setInterval(function() {
          handleChat('', '', 'fuck');
        }, 100);
        setInterval(function() {
          handleChat('', '', 'qwer');
        }, 100);
        setInterval(function() {
          handleChat('', '', 'Kappa '.concat(Math.round((Math.random() * 100)).toString()));
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
  });

  client.connect();
}

function handleChat(channel, user, message, self) {
  if (!document.hidden)
    if (message.length <= length)
      newChat.push(message);
}