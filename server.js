const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/eliza', (req, res) => {
    const userInput = req.query.input;
    
    // Check if userInput is provided
    if (!userInput) {
        // Respond with 400 Bad Request if userInput is missing
        res.status(400).send('Input is required');
        return;
    }
    
    const pythonProcess = spawn('python', ['eliza.py', userInput]);
    
    // Collect data from script
    let scriptOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    // When the script has finished execution, send back the response
    pythonProcess.stdout.on('end', () => {
        // Set Content-Type to 'text/plain'
        res.type('text/plain');
        res.send(scriptOutput);
    });

    // Handle errors emitted by the Python script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error executing Eliza script');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;