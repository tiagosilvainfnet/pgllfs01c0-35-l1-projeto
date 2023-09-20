const chat1 = `
    <li class="message right appeared">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">texto_aqui</div>
        </div>
    </li>
`;

const chat2 = `
    <li class="message left appeared">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">texto_aqui</div>
        </div>
    </li>
`;

const messages = document.getElementById('messages');
const user = JSON.parse(window.localStorage.getItem("user"));

const loadChat = async (user_id, friend_id) => {
    const response = await fetch(`${window.location.origin}/chat?user_id=${user_id}&friend_id=${friend_id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json();

    let lis = ''
    json.rows.forEach(async (chat) => {
        if(chat.user_consumer === user.id){
            lis += chat1.replace('texto_aqui', chat.message);
        }else{
            lis += chat2.replace('texto_aqui', chat.message);
        }
    })

    messages.innerHTML = lis
}

const logout = () => {
    window.localStorage.clear();
    window.location.href = `${window.location.origin}/login`
}


// Listar os friends
// Enviar mensagens via socket e carregar via socket
// Deslogar

loadChat(1, 2)