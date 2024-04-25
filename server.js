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

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            res.status(500).send('Error executing Eliza script');
            return;
        }

        const responseChunks = scriptOutput.trim().split('\n');
        console.log(`Response chunks received from Python script: ${responseChunks}`);

        // Set Content-Type to 'application/json'
        res.type('application/json').json({ chunks: responseChunks });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;