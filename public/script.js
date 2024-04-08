let chatHistory = [];
let recognition; // Declare the recognition variable globally
let listeningIndicatorInterval;
let isSpeechMode = false; // Flag to track the selected input mode
let isBotListening = false;
document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.w3-bar-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Hide all sections
                document.querySelectorAll('.w3-content').forEach(section => {
                    section.style.display = 'none';
                });
                // Show the target section
                targetSection.style.display = 'block';

                // If the clicked tab is the "Text" tab, show the chat section
                if (targetId === '#text') {
                    document.getElementById('chat').style.display = 'block';
                } else {
                    // Hide the chat section for other tabs
                    document.getElementById('chat').style.display = 'none';
                }
            }
        });
    });
    const speechBtn = document.getElementById('speech-btn');
    if (speechBtn) {
        speechBtn.addEventListener('click', function(event) {
            toggleInputMode();
        });
    }
});

function toggleInputMode() {
    const textInputContainer = document.getElementById('input-container');

    // Toggle the input mode
    isSpeechMode = !isSpeechMode;

    if (isSpeechMode) {
        startSpeechRecognition();
        textInputContainer.style.display = 'none';
    } else {
        stopSpeechRecognitionEngine();
        textInputContainer.style.display = 'flex';
    }
}

function sendToEliza() {
    let userInputElem = document.getElementById('userInput');
    if (userInputElem) {
        const userInput = userInputElem.value;

        if (!userInput) {
            return Promise.resolve(); // Don't send empty messages
        }

        const timestamp = getCurrentTimestamp();

        // Add user input to chat history
        chatHistory.push({ sender: 'User', message: userInput, timestamp });

        // Update the chat display
        updateChatDisplay();

        // Clear the user input
        userInputElem.value = '';
        isBotListening = true;
        updateChatDisplay();

        // Send user input to Eliza
        return fetch(`/eliza?input=${encodeURIComponent(userInput)}`)
            .then(response => response.text())
            .then(data => {
                isBotListening = false;
                // Add Eliza's response to chat history
                chatHistory.push({ sender: 'Eliza', message: data, timestamp });

                // Update the chat display
                updateChatDisplay();
            })
            .catch(error => {
                console.error('Error:', error);
                return Promise.reject(error);
            });
    } else {
        return Promise.resolve();
    }
}