function createEmptyMessage() {
  const emptyMessage = document.createElement("p");
  emptyMessage.textContent("Everyone is being quite, say something.");
  return emptyMessage;
}

function createMessageThreads(chatHistoryArray) {
  return chatHistoryArray.map(({ message, user }) => {
    const chatThread = document.createElement("section");
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    const userElement = document.createElement("p");
    userElement.textContent = user;
    chatThread.append(messageElement, userElement);
    return chatThread;
  });
}

async function fetchChatHistory() {
  try {
    const response = await fetch("http://localhost:4000");
    const chatHistoryArray = await response.json();
    return chatHistoryArray;
  } catch (error) {
    console.log(`Failed to fetch chat history`);
  }
}

async function chatDisplay() {
  const chatDisplayArea = document.getElementById("chat-display-area");
  const chatHistoryArray = await fetchChatHistory();
  if (!chatHistoryArray) {
    chatDisplayArea.append(createEmptyMessage());
  } else {
    chatDisplayArea.append(...createMessageThreads(chatHistoryArray));
  }
  console.log(chatHistoryArray);
}

window.onload = async () => {
  await chatDisplay();
};
