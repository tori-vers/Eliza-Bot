// Function to send message to server
async function sendMessage(message) {
    try {
        console.log('Sending message to server:', message); 
        const username = getUsername(); 

        const response = await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, message })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Message sent successfully');
            document.getElementById('userInput').value = '';

            await sendToServer(message);
            displayMessage(message, 'user');
        } else {

            console.error('Error sending message:', data.message);
        }
    } catch (error) {
        console.error('Error sending message:', error);

    }
}

// Function to get the username
function getUsername() {
    console.log("Get Username function recieved");
    // stored the username in localStorage
    const user = localStorage.getItem('user');
    console.log("Retrieved user: " + user);
    return user; 
}

async function sendToEliza() {
    console.log("send to Eliza recieved");
    const userInput = document.getElementById('userInput').value;

    //Send user input to the server
    await sendMessage(userInput);
    event.preventDefault();

    document.getElementById('message-result').innerText = 'How do you do. Please state your problem.';
}
