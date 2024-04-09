let chatHistory = [];
let recognition; // Declare the recognition variable globally
let listeningIndicatorInterval;
let isSpeechMode = false; // Flag to track the selected input mode
let isBotListening = false;


if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
   window.addEventListener('DOMContentLoaded', (event) => {
       const userInputElem = document.getElementById('userInput');
       if (userInputElem) {
         userInputElem.addEventListener('keyup', function (event) {
           if (event.key === 'Enter') {
             sendToEliza();
           }
       });
   }
});
}


// Function to toggle between text and speech input mode
function toggleInputMode() {
   const textInputContainer = document.getElementById('input-container');
   const speechBtn = document.getElementById('speech-btn');


   // Toggle the input mode
   isSpeechMode = !isSpeechMode;


   if (isSpeechMode) {
       // Start listening indicator
       const listeningIndicator = document.getElementById('listening-indicator');
       startListeningIndicator(listeningIndicator);


       // Hide the text input container
       textInputContainer.style.display = 'none';
   } else {
       // Stop listening indicator
       stopListeningIndicator();


       // Show the text input container
       textInputContainer.style.display = 'flex';
   }


   // Update the button text based on the selected mode
   speechBtn.innerText = isSpeechMode ? 'Stop Speech' : 'Speech';


   // If switching from speech mode, stop speech recognition
   if (!isSpeechMode) {
       stopSpeechRecognitionEngine();
   }


}


function updateChatDisplay() {
   const chatContainer = document.getElementById('chat-history-container');
   chatContainer.innerHTML = '';




   if (isBotListening) {
       const listeningMessage = document.createElement('div');
       listeningMessage.className = 'eliza';
       listeningMessage.innerHTML = 'Listening...';
       chatContainer.appendChild(listeningMessage);
   }


   // Display chat history
   chatHistory.forEach(entry => {
       const messageElement = document.createElement('div');
       messageElement.className = entry.sender.toLowerCase();


       const timestampElement = document.createElement('span');
       timestampElement.className = 'timestamp';
       timestampElement.innerText = `[${entry.timestamp}]`;


       messageElement.innerHTML = `<strong>${entry.sender}:</strong> ${entry.message}`;
       messageElement.appendChild(timestampElement);


       chatContainer.appendChild(messageElement);
   });
}


function getCurrentTimestamp() {
   const now = new Date();
   const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.toDateString()}`;
   return timestamp;
}
function startSpeechRecognition() {
   const speechBtn = document.getElementById('speech-btn');
   const listeningIndicator = document.getElementById('listening-indicator');


   if (!isSpeechMode) {
       startListeningIndicator(listeningIndicator);
       recognition = new webkitSpeechRecognition();
       startSpeechRecognitionEngine();
       speechBtn.innerHTML = 'Stop';
   } else {
       stopListeningIndicator();
       stopSpeechRecognitionEngine();
       speechBtn.innerHTML = 'Mic';
    }


   isSpeechMode = !isSpeechMode;
}


function startListeningIndicator(element) {
   let ellipsesCount = 1;
   listeningIndicatorInterval = setInterval(() => {
       const ellipses = '.'.repeat(ellipsesCount);
       element.innerText = isBotListening ? `Listening${ellipses}` : '';
       ellipsesCount = (ellipsesCount % 3) + 1;


       // Append the indicator directly to the chat log container
       const chatLogContainer = document.getElementById('chat-log-container');
       chatLogContainer.appendChild(element);
   }, 500);
}


function stopListeningIndicator() {
   clearInterval(listeningIndicatorInterval);
   document.getElementById('listening-indicator').innerText = ''; // Clear the text
}


function startSpeechRecognitionEngine() {
   recognition.continuous = true;


   recognition.onstart = function () {
       console.log('Speech recognition started');
   };


   recognition.onresult = function (event) {
       const last = event.results.length - 1;
       const spokenText = event.results[last][0].transcript;


       document.getElementById('userInput').value = spokenText;


       // Trigger the sendToEliza function when speech recognition is successful
       sendToEliza();
   };


   recognition.onerror = function (event) {
       console.error('Speech recognition error', event.error);
       stopSpeechRecognitionEngine();
   };


   recognition.onend = function () {
       console.log('Speech recognition ended');
       if (isSpeechMode) {
           startSpeechRecognitionEngine();
       }
   };


   recognition.start();
}


function stopSpeechRecognitionEngine() {
   recognition.stop();
}


// Update the sendToEliza function to handle both text and speech input
function sendToEliza() {
   let userInputElem = document.getElementById('userInput');
   if (userInputElem) {
     const userInput = userInputElem.value;
      if (!userInput) {
       return Promise.resolve; // Don't send empty messages
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


module.exports = {
   chatHistory,
   updateChatDisplay,
   sendToEliza
}
document.addEventListener('DOMContentLoaded', function() {
    const calendarDateInput = document.getElementById('calendar-date');
    const searchButton = document.getElementById('search-button');
    const miniCalendar = document.getElementById('mini-calendar');
    const monthYearDisplay = document.getElementById('month-year');
    const calendarBody = document.getElementById('calendar-body');
  
    let currentDate = new Date();
  
    function generateCalendar(year, month) {
      // Clear previous calendar
      calendarBody.innerHTML = '';
      monthYearDisplay.textContent = `${getMonthName(month)} ${year}`;
      
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();
      const startingDay = firstDayOfMonth.getDay();
  
      let date = 1;
  
      for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < startingDay) {
            const cell = document.createElement('td');
            row.appendChild(cell);
          } else if (date > daysInMonth) {
            break;
          } else {
            const cell = document.createElement('td');
            cell.textContent = date;
            cell.dataset.date = `${year}-${padZero(month + 1)}-${padZero(date)}`;
            cell.addEventListener('click', handleDateClick);
            row.appendChild(cell);
            date++;
          }
        }
        calendarBody.appendChild(row);
      }
    }
  
    function getMonthName(month) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[month];
    }
  
    function padZero(num) {
      return num < 10 ? `0${num}` : num;
    }
  
    function handleDateClick(event) {
      const selectedDate = event.target.dataset.date;
      calendarDateInput.value = selectedDate;
    }
  
    function searchConversations() {
      const selectedDate = calendarDateInput.value;
      // Implement conversation search based on selected date
    }
  
    searchButton.addEventListener('click', searchConversations);
  
    // Initial calendar generation
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  });