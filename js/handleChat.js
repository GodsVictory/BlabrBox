function handleChat(channel, user, message, self) {
  if (!document.hidden) {
    var exists = false;
    for (var i = messages.length - 1; i >= 0; i--)
      if (message == messages[i].text) {
        exists = true;
        messages[i].grow += 10;
        break;
      }
    if (!exists && message.length < 30)
      messages.push(Chat(message));
  }
}