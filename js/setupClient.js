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
    var channel = Qurl.create().query('c');
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
      client.join(channel);
  });
  client.connect();
}