// Import required modules
const express = require('express');
const mysql = require('mysql');
const { spawn } = require('child_process');

// Create Express application
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public', {
    index: 'login.html',
    extensions: ['html', 'js'], // Allow serving .js files
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}));

// Parse JSON requests
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'eliza', // MySQL username
    password: 'blackcat', // MySQL password
    database: 'chatbot_db' // db name 
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});

// Register endpoint
app.post('/register', (req, res) => {
    console.log('Received registration request:', req.body);

    const { username, password } = req.body;

    // Check if username already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkQuery, [username], (error, results) => {
        if (error) {
            console.error('Error checking username: ', error);
            res.status(500).json({ success: false, message: 'Error checking username' });
            return;
        }
        
        // If username already exists
        if (results.length > 0) {
            res.status(409).json({ success: false, message: 'Username already exists' });
            return;
        }

        // Insert new user into database
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(insertQuery, [username, password], (error, results) => {
            if (error) {
                console.error('Error registering user: ', error);
                res.status(500).json({ success: false, message: 'Error registering user' });
                return;
            }
            console.log('User registered successfully:', username);
            res.json({ success: true, message: 'User registered successfully'});
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    console.log('Received login request:', req.body);

    const { username, password } = req.body;

    // Authenticate user
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Error authenticating user: ', error);
            res.status(500).json({ success: false, message: 'Error authenticating user' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
            return;
        }
        console.log('User authenticated successfully:', username);
        res.json({ success: true, message: 'User authenticated successfully'});
    });
});

// Endpoint to handle incoming chat messages
app.post('/send-message', (req, res) => {
    console.log('Received send-message request:', req.body);
    const { username, message } = req.body;

    // Query to retrieve the user ID based on the username
    const userQuery = 'SELECT id FROM users WHERE username = ?';
    connection.query(userQuery, [username], (error, results) => {
        if (error) {
            console.error('Error retrieving user ID:', error);
            res.status(500).json({ success: false, message: 'Error sending message' });
            return;
        }
        
        if (results.length === 0) {
            console.error('User not found');
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        
        const userId = results[0].id; // Assuming there's only one user with a given username

        // Insert message into chat_messages table
        const insertQuery = 'INSERT INTO chat_messages (user_id, message) VALUES (?, ?)';
        connection.query(insertQuery, [userId, message], (error, results) => {
            if (error) {
                console.error('Error inserting message into chat history:', error);
                res.status(500).json({ success: false, message: 'Error sending message' });
                return;
            }
            console.log('Message sent successfully:', message);
            res.json({ success: true, message: 'Message sent successfully' });
        });
    });
});

// Endpoint to fetch chat history based on date
app.get('/chat-history', (req, res) => {
    const { date } = req.query;
    const query = 'SELECT * FROM chat_messages WHERE DATE(timestamp) = ?';
    connection.query(query, [date], (error, results) => {
        if (error) {
            console.error('Error fetching chat history:', error);
            res.status(500).json({ success: false, message: 'Error fetching chat history' });
            return;
        }
        res.json(results); 
    });
});



// Eliza endpoint
app.get('/eliza', (req, res) => {
    const userInput = req.query.input;

    // Check if userInput is provided
    if (!userInput) {
        // Respond with 400 Bad Request if userInput is missing
        res.status(400).send('Input is required');
        return;
    }
    
    const pythonProcess = spawn('python3', ['eliza.py', userInput]);

    // Collect data from script
    let scriptOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            console.error(`Script output: ${scriptOutput}`);
            res.status(500).send('Error executing Eliza script');
        } else {
            console.log(`Script output: ${scriptOutput}`);
            const lines = scriptOutput.trim().split('\n');
            let lastLine = lines[lines.length - 1];
            console.log(`Response received from Python script: '${lastLine}'`);
            // Set Content-Type to 'text/plain'
            res.type('text/plain').send(lastLine);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
