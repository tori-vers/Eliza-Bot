document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {

        localStorage.setItem('user', username)

        // Redirect user to main page 
        window.location.href = '/index.html';
    } else {

        document.getElementById('message').innerText = data.message;
    }
});
