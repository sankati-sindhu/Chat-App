const form = document.getElementById('reg-form')
form.addEventListener('submit', function(event){
    console.log('the user submitted form');
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    console.log(username, password)
    const result = fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    console.log(result)
});