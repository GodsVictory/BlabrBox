function handleChat(channel, user, message, self) {
  if (!document.hidden) {
    var exists = false;
    for (var i = app.stage.children.length - 1; i >= 0; i--) {
      if (message == app.stage.children[i].text) {
        exists = true;
        app.stage.children[i].grow += 50;
        break;
      }
    }
    if (!exists && message.length < 30)
      Chat(message);
  }
}
