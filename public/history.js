async function fetchChatHistory() { //fetch
    console.log("chat history function");
    const date = document.getElementById('calendar-date').value;
    try {
        console.log("fetch chat history try entered");
        const response = await fetch(`/chat-history?date=${date}`);
        const data = await response.json();
        displayChatHistory(data); 
    } catch (error) {
        console.error('Error fetching chat history:', error);
    }
}

// Function to display chat history 
function displayChatHistory(chatHistory) {
    const conversationResults = document.getElementById('chat-history-container');
    conversationResults.innerHTML = ''; // Clear previous results
    
    // display chat history all
    chatHistory.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerText = `${message.timestamp}: ${message.message}`;
        conversationResults.appendChild(messageElement);
    });
}
