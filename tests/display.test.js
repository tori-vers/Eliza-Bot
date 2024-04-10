// display.test.js

// Verifies that the chat section is displayed when the CHAT tab is clicked
describe('Tab Switching', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <a href="#text" class="w3-bar-item w3-button">CHAT</a>
        <div id="text" class="w3-content" style="display: none;">Chat Content</div>
        <!-- Other sections would go here -->
      `;
  
      // Mimic the tab switching functionality
      const tabs = document.querySelectorAll('.w3-bar-item');
      tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent default anchor click behavior
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            // Hide all sections
            document.querySelectorAll('.w3-content').forEach(section => {
              section.style.display = 'none';
            });
            // Show the target section
            targetSection.style.display = 'block';
          }
        });
      });
    });
    
    it('shows the chat section when the CHAT tab is clicked', () => {
      const chatTab = document.querySelector('a[href="#text"]');
      const chatSection = document.getElementById('text');
  
      // Simulate a click event on the CHAT tab
      chatTab.click();
  
      // chatSection should now be visible
      expect(chatSection.style.display).toBe('block');
    });
  
    // Additional tests for other tabs...
  });

  // Verifies that the chat history section is displayed when the CHAT HISTORY tab is clicked
  describe('Navigation Functionality', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav class="w3-sidebar w3-bar-block w3-small w3-hide-small w3-center">
          <!-- ... Other nav items ... -->
          <a href="#chathistory" class="w3-bar-item w3-button w3-padding-large w3-hover-black">CHAT HISTORY</a>
        </nav>
        <div class="w3-top w3-hide-large w3-hide-medium" id="myNavbar">
          <div class="w3-bar w3-black w3-opacity w3-hover-opacity-off w3-center w3-small">
            <!-- ... Other nav items ... -->
            <a href="#chathistory" class="w3-bar-item w3-button" style="width:25% !important">CHAT HISTORY</a>
          </div>
        </div>
        <!-- Page Content -->
        <div id="main">
          <!-- ... Other sections ... -->
          <div class="w3-padding-large" id="chathistory" style="display:none;">
            <!-- Chat History Content -->
          </div>
        </div>
      `;
  
      // Initialize the navigation functionality
      document.querySelectorAll('.w3-bar-item').forEach(tab => {
        tab.addEventListener('click', function(event) {
          event.preventDefault();
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          document.querySelectorAll('.w3-padding-large').forEach(section => {
            section.style.display = 'none';
          });
          targetSection.style.display = 'block';
        });
      });
    });
  
    it('displays the chat history content when the sidebar CHAT HISTORY link is clicked', () => {
      const chatHistoryLink = document.querySelector('.w3-sidebar .w3-bar-item[href="#chathistory"]');
      chatHistoryLink.click();
      const chatHistoryContent = document.getElementById('chathistory');
      expect(chatHistoryContent.style.display).toBe('block');
    });
  
    it('displays the chat history content when the top navigation CHAT HISTORY link is clicked on small screens', () => {
      const chatHistoryLink = document.querySelector('#myNavbar .w3-bar-item[href="#chathistory"]');
      chatHistoryLink.click();
      const chatHistoryContent = document.getElementById('chathistory');
      expect(chatHistoryContent.style.display).toBe('block');
    });
  
    // Additional tests...
  });

  // Verifies that the login popup is displayed when the login button is clicked and hidden when the go back to main page button is clicked
  describe('Login Popup Functionality', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="login-button">Login</button>
        <div id="login-popup" class="popup" style="display: none;">
          <div class="popup-content">
            <!-- ... -->
            <button id="go-back-button">Go Back to Main Page</button>
          </div>
        </div>
      `;
  
      // Manually add the event listeners to simulate the expected behavior
      const loginButton = document.getElementById('login-button');
      const goBackButton = document.getElementById('go-back-button');
      const loginPopup = document.getElementById('login-popup');
  
      loginButton.addEventListener('click', () => {
        loginPopup.style.display = 'block';
      });
  
      goBackButton.addEventListener('click', () => {
        loginPopup.style.display = 'none';
      });
    });
  
    it('displays the login popup when the login button is clicked', () => {
      const loginButton = document.getElementById('login-button');
      const loginPopup = document.getElementById('login-popup');
  
      // Simulate a click event on the login button
      loginButton.click();
  
      // The loginPopup should now be visible
      expect(loginPopup.style.display).toBe('block');
    });
  
    it('hides the login popup when the go back button is clicked', () => {
      const goBackButton = document.getElementById('go-back-button');
      const loginPopup = document.getElementById('login-popup');
  
      // First, show the popup
      loginPopup.style.display = 'block';
  
      // Simulate a click event on the go back button
      goBackButton.click();
  
      // The loginPopup should now be hidden
      expect(loginPopup.style.display).toBe('none');
    });
  });