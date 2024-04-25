# Eliza-Bot
Welcome to our Eliza Program! We have aimed to enhance Joseph Weizenbaum's original Eliza program's function in a way that feels modern and unique!

## Dependencies
To run our application, you'll need to have the following dependencies installed:
-Node.js (version 14 or higher) 
-Python (version 3.6 or higher) 
-MySQL (version 8.0 or higher)

## SQL Server Connection
You can connect to our SQL server by using the information below:
-Host: 173.207.200.33
-Port: 3306
-User: eliza
-Password: blackcat

## How to Run
1. To begin running the program, install node modules by opening a terminal and typing `npm install` in the project directory.
2. Then in the terminal, type `node server.js` to start running the server on PORT:3000.

## Additional Dependencies
The following additional dependencies may need to be installed in the project directory if not already on your system:
- OpenAI (`pip install openai`)
- Jest (`pip install jest`)

#### Project Structure

The project consists of the following main files and directories:
- `server.js`: The main server file that handles the Express.js server and routes.
- `eliza.py`: The Python script that implements the Eliza chatbot functionality.
- `public/`: Directory containing the client-side files (HTML, CSS, JavaScript).
  - `index.html`: The main HTML file for the Eliza chatbot interface.
  - `script.js`: The JavaScript file that handles client-side interactions and communication with the server.
  - `style.css`: The CSS file for styling the Eliza chatbot interface.
- `tests/`: Directory containing the test files.
  - `test_eliza.py`: Python test file for testing the Eliza chatbot functionality.
  - `server.test.js`: JavaScript test file for testing the server functionality.
- `doctor.txt`: The script file used by the Eliza chatbot for generating responses. (Our application uses a mix of ChatGPT3.5 Turbo and legacy Eliza responses)

### ### Python Tests

The Python tests are located in the `tests/test_eliza.py` file. To run the Python tests, use the following command: python -m pytest tests/test_eliza.py

### JavaScript Tests

The JavaScript tests are located in the `tests/server.test.js` file. To run the JavaScript tests, use the following command: npm test

## Contributors

- Erykah J
- Victoria V
- Alex M
- Robert U
