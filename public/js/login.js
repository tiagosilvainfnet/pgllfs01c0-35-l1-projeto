const login = async () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try{
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
        window.localStorage.setItem("user", JSON.stringify(json));
        window.location.href = `${window.location.origin}/`;
    }catch(e){
        alert("Não foi possível realizar login");
    }
}