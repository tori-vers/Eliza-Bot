let chatHistory = [];
let recognition; // Declare the recognition variable globally
let listeningIndicatorInterval;
let isSpeechMode = false; // Flag to track the selected input mode
let isBotListening = false;
const idleVideoUrl = 'https://ugc-idle.s3-us-west-2.amazonaws.com/est_1dc88daaa1eb74c1e50d8722328860a3.mp4';

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


function startListeningIndicator() {
  let ellipsesCount = 1;
  listeningIndicatorInterval = setInterval(() => {
      let listeningIndicatorElem = document.getElementById('listening-indicator');
      if (!listeningIndicatorElem) {
          listeningIndicatorElem = document.createElement('div');
          listeningIndicatorElem.id = 'listening-indicator';
          const chatLogContainer = document.getElementById('chat-log-container');
          if (chatLogContainer) {
              chatLogContainer.appendChild(listeningIndicatorElem);
          }
      }
      const ellipses = '.'.repeat(ellipsesCount);
      listeningIndicatorElem.innerText = isBotListening ? `Listening${ellipses}` : '';
      ellipsesCount = (ellipsesCount % 3) + 1;
  }, 500);
}


function stopListeningIndicator() {
  clearInterval(listeningIndicatorInterval);
  const listeningIndicatorElem = document.getElementById('listening-indicator');
  if (listeningIndicatorElem) {
      listeningIndicatorElem.innerText = ''; // Clear the text only if the element exists
  }
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


// Updated sendToEliza function to handle both text and speech input
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
      
              // Send user input to Eliza
              return fetch(`/eliza?input=${encodeURIComponent(userInput)}`)
              .then(response => response.text())
              .then(data => {
                  isBotListening = false;
                  // Add Eliza's response to chat history
                  chatHistory.push({ sender: 'Eliza', message: data, timestamp });
                  // Update the chat display
                  updateChatDisplay();
  
                  // Generate the talking head lipsync video
                  return generateLipsync(data);
              })
              .then(lipsyncVideoUrl => {
                  // Update the source of the video element with the new lipsync video URL
                  let virtualHumanVideo = document.getElementById('virtual-human');
                  if (virtualHumanVideo) {
                      virtualHumanVideo.src = lipsyncVideoUrl;
                  }
              })
              .catch(error => {
                  console.error('Error:', error);
                  return Promise.reject(error);
              });
      } else {
          return Promise.resolve();
      }
  }
  
  function generateLipsync(text) {
    const apiKey = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImFsZXhkbWF5MTU5OUBnbWFpbC5jb20ifQ.AlH7kFZWAOhGfQwTCZQhWY5HHHnZ1vd8j1pRbzxnwQHW4HvzvoLspTZ7_3MSeWpnNCP6NLJ7rl0TKdPiZNxgOg'; // Replace with your actual API key
    const idleUrl = 'https://ugc-idle.s3-us-west-2.amazonaws.com/est_1dc88daaa1eb74c1e50d8722328860a3.mp4'; // Replace with your actual idle_url
    const voiceName = 'Fay'; // Replace with the desired voice name

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            idle_url: idleUrl,
            voice_name: voiceName,
            // Add other parameters as required by the API
        })
    };

    return fetch('https://api.exh.ai/animations/v3/generate_lipsync', options)
    .then(response => {
        if (!response.ok) {
            // If the response is not OK, throw an error with the status text
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Check if the response content type is video/mp4
        if (response.headers.get('Content-Type').includes('video/mp4')) {
            return response.blob(); // If it's a video file, get a blob
        } else {
            return response.json(); // Otherwise, parse it as JSON
        }
    })
    .then(data => {
        if (data instanceof Blob) {
            // Create a URL for the video blob
            const videoUrl = URL.createObjectURL(data);
            return videoUrl;
        } else {
            // If the response is JSON, handle it as needed
            // Assuming the JSON contains a property with the video URL
            if (typeof data === 'object' && data.lipsyncVideoUrl) {
                return data.lipsyncVideoUrl;
            } else {
                console.error('Unexpected response structure:', data);
                return Promise.reject('Unexpected response structure.');
            }
        }
    })
    .catch(error => {
        console.error('Error in generateLipsync:', error);
        throw error;
    });
}

// Function to switch to the idle video
function switchToIdleVideo() {
  console.log('Attempting to switch to idle video.');
  const virtualHumanVideo = document.getElementById('virtual-human');
  if (virtualHumanVideo) {
      virtualHumanVideo.src = idleVideoUrl;
      virtualHumanVideo.loop = true;
      virtualHumanVideo.load(); // Ensure this call is here
      virtualHumanVideo.play().then(() => {
          console.log('Idle video is playing.');
      }).catch((error) => {
          console.error('Error playing the idle video:', error);
      });
  } else {
      console.error('Failed to find the virtual-human video element for idle video.');
  }
}

function updateTalkingHead(videoUrl) {
  console.log('updateTalkingHead called with URL:', videoUrl);
  const virtualHumanVideo = document.getElementById('virtual-human');
  if (virtualHumanVideo) {
      const cacheBustingUrl = videoUrl + '?t=' + new Date().getTime();
      console.log('Setting video source to:', cacheBustingUrl);
      
      virtualHumanVideo.src = cacheBustingUrl;
      virtualHumanVideo.loop = false;

      virtualHumanVideo.load();

      virtualHumanVideo.onended = () => {
          console.log('Talking head video ended. About to switch to idle video.');
          switchToIdleVideo();
      };

      virtualHumanVideo.play().then(() => {
          console.log('Talking head video is playing.');
      }).catch((error) => {
          console.error('Error playing the talking head video:', error);
      });
  } else {
      console.error('Failed to find the virtual-human video element for talking head video.');
  }
}


let calendarDateInput;
let miniCalendar;
let monthYearDisplay;
let calendarBody;
let virtualHumanVideo;
let searchButton;


document.addEventListener('DOMContentLoaded', function() {
  calendarDateInput = document.getElementById('calendar-date');
  miniCalendar = document.getElementById('mini-calendar');
  monthYearDisplay = document.getElementById('month-year');
  calendarBody = document.getElementById('calendar-body');
  virtualHumanVideo = document.getElementById('virtual-human');
  searchButton = document.getElementById('search-button');

  // If calendarBody exists, then we can generate the calendar.
  if (calendarBody) {
    const currentDate = new Date();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  // If searchButton exists, add an event listener
  if (searchButton) {
    searchButton.addEventListener('click', searchConversations);
  }

  // Other initialization code...
});

    function generateCalendar(year, month) {
      // Clear previous calendar
      let currentDate = new Date();
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
      const calendarDateInput = document.getElementById('calendar-date'); // Make sure this ID matches your input's ID in the HTML
      const selectedDate = calendarDateInput.value;
      // Implement conversation search based on selected date
  }
  
  
  // Module exports
  if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
          chatHistory,
          updateChatDisplay,
          sendToEliza,
          generateCalendar
      };
    }