const rota = window.location.pathname;

const verifyLogin = () => {
    const user = JSON.parse(window.localStorage.getItem("user") || null);

    if(user){
        if(rota === '/login'){
            window.location.href = `${window.location.origin}/`
        }
    }else{
        if(rota === '/'){
            window.location.href = `${window.location.origin}/login`
        }
    }
}

verifyLogin()