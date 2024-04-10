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


  // Verifies that submitting the login form sends the correct data to the server
  describe('Login Form', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form action="/login" method="post" class="w3-container" id="login-form">
          <input class="w3-input" type="text" placeholder="Username" required name="username" id="username">
          <input class="w3-input" type="password" placeholder="Password" required name="password" id="password">
          <button class="w3-button" type="submit">Log In</button>
        </form>
      `;
  
      // Mock the global fetch function
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        })
      );
    });
  
    it('sends username and password on form submission', async () => {
      const loginForm = document.getElementById('login-form');
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
  
      // Simulate user input
      usernameInput.value = 'testuser';
      passwordInput.value = 'password123';
  
      // Prevent the default form submission and manually call the fetch mock
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        global.fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value,
          }),
        });
      });
  
      // Simulate form submission
      const formSubmitEvent = new Event('submit');
      loginForm.dispatchEvent(formSubmitEvent);
  
      // Wait for the asynchronous code to finish
      await new Promise(process.nextTick);
  
      // Check if fetch was called during form submission
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        '/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'testuser',
            password: 'password123',
          }),
        })
      );
    });
  
    afterEach(() => {
      // Reset mocks
      global.fetch.mockClear();
    });
  });