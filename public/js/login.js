const login = async () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const response = await fetch(`${window.location.origin}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    const json = await response.json();
    console.log(json)
}