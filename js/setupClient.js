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
    if (channel)
      client.join(channel);
  });
  client.connect();
}