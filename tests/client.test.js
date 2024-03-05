/**
 * @jest-environment jsdom
 */

const { sendToEliza, updateChatDisplay, chatHistory } = require('../public/script');

// Mock the global fetch function
beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
        text: () => Promise.resolve('Mocked Eliza response')
    }));
    // Reset the chatHistory array before each test
    chatHistory.length = 0;
    // Set up your DOM element mocks here
    document.body.innerHTML = `
        <input type="text" id="userInput">
        <div id="chat-history-container"></div>
    `;
});

// Test suite for the sendToEliza function on the client-side
describe('sendToEliza', () => {
    // Test case for verifying that sendToEliza sends user input to the server and updates the display
    it('sends user input to Eliza and updates display', async () => {
        // Set up user input
        const userInput = document.getElementById('userInput');
        userInput.value = 'Hello';
    
        // Call the sendToEliza function and wait for the Promise to resolve
        await sendToEliza();
    
        // Now that the fetch Promise has been resolved, we can test the chatContainer content
        const chatContainer = document.getElementById('chat-history-container');
        expect(chatContainer.textContent).toContain('Hello');
        expect(chatContainer.textContent).toContain('Mocked Eliza response');
    });

    // Additional tests for sendToEliza function...
});

// Test suite for the updateChatDisplay function on the client-side
describe('updateChatDisplay', () => {
    it('updates chat display with the conversation', () => {
        // Add messages to the chat history
        const timestamp = 'timestamp';
        chatHistory.push({ sender: 'User', message: 'Hello', timestamp });
        chatHistory.push({ sender: 'Eliza', message: 'Mocked Eliza response', timestamp });

        // Call updateChatDisplay to update the chat log
        updateChatDisplay();

        const chatContainer = document.getElementById('chat-history-container');
        // Check if chatContainer contains the user's message
        expect(chatContainer.textContent).toContain('Hello');
        // Check if chatContainer contains Eliza's response
        expect(chatContainer.textContent).toContain('Mocked Eliza response');
    });

    // Additional tests for updateChatDisplay function...
});