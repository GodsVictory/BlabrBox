function handleChat(channel, user, message, self) {
  if (!document.hidden) {
    var exists = false;
    for (var i = chatContainer.children.length - 1; i >= 0; i--) {
      if (message == chatContainer.children[i].text) {
        exists = true;
        chatContainer.children[i].grow += 30;
        break;
      }
    }
    if (!exists && message.length < 30)
      Chat(message);
  }
}