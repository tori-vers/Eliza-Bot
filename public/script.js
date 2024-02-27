function sendToEliza() {
    const userInput = document.getElementById('userInput').value;
    fetch(`/eliza?input=${encodeURIComponent(userInput)}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('elizaResponse').innerText = data;
        })
        .catch(error => console.error('Error:', error));
}