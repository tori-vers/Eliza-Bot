const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/eliza', (req, res) => {
    const userInput = req.query.input; 
    const pythonProcess = spawn('python', ['eliza.py', userInput]);

    pythonProcess.stdout.on('data', (data) => {
        res.send(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error executing Eliza script');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});