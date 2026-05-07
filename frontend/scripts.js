const state = {
  messageString: "",
  userString: ""
}


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
  chatDisplayArea.innerHTML = '';
  const chatHistoryArray = await fetchChatHistory();
  if (!chatHistoryArray) {
    chatDisplayArea.append(createEmptyMessage());
  } else {
    chatDisplayArea.append(...createMessageThreads(chatHistoryArray));
  }
}

function messageInputReset() {
  state.messageString = "";
  state.userString = "";
  const messageInputElement = document.getElementById("message-input");
  const userInputElement = document.getElementById("user-name-input");
  messageInputElement.value = "";
  userInputElement.value = "";
}

async function postingMessage(messageString, userString) {
  try {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messageString,
        user: userString
      })
    })
    if (response.ok) {
      const confirmMessage = await response.text();
      if (confirmMessage == "sent") {
        chatDisplay();
        messageInputReset();
      }
    }
  } catch (error) {
    console.error(`Failed to post message: ${error}`)
  }
}

async function messageSubmitHandler(e, messageString, userString) {
  e.preventDefault();
  if (!messageString || !userString) {
    console.error(`Message or user cannot be empty.`)
    window.alert("Message or user cannot be empty.")
    return;
  } else {
    await postingMessage(messageString, userString)
  }
}

function messageInputHandler() {
  
  const messageInputElement = document.getElementById("message-input")
  messageInputElement.addEventListener("input", (e) => {
    state.messageString = e.target.value.trim();
  })

  const userInputElement = document.getElementById("user-name-input")
  userInputElement.addEventListener("input", (e) => {
    state.userString = e.target.value.trim();
  })

  document.getElementById("message-submit-button").addEventListener("click", async (e) => {
    await messageSubmitHandler(e, state.messageString, state.userString)
  })
}

window.onload = async () => {
  await chatDisplay();
  messageInputHandler();
};
