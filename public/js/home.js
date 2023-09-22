const chat1 = `
    <li class="message right appeared message-text">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">texto_aqui</div>
        </div>
    </li>
`;

const chat2 = `
    <li class="message left appeared message-text">
        <div class="avatar"></div>
        <div class="text_wrapper">
            <div class="text">texto_aqui</div>
        </div>
    </li>
`;

const messages = document.getElementById('messages');
const user = JSON.parse(window.localStorage.getItem("user"));
const chat_window = document.getElementById('chat_window');
const user_friend_name = document.getElementById('user_friend_name');
let friend = {};

const loadChat = async (user_id, friend_id, friend_name) => {
    friend = {
        id: friend_id,
        name: friend_name
    }

    user_friend_name.innerHTML = friend_name;

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
        if(chat.user_sender === user.id){
            lis += chat1.replace('texto_aqui', chat.message);
        }else{
            lis += chat2.replace('texto_aqui', chat.message);
        }
    })

    messages.innerHTML = lis;
    document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;
    chat_window.style.display = 'block';
}

closeChat = () => {
    chat_window.style.display = 'none';
    messages.innerHTML = '';
}

const logout = () => {
    window.localStorage.clear();
    window.location.href = `${window.location.origin}/login`
}

const getFriends = async () => {
    // http://localhost:3000/friends?user_id=1
    const response = await fetch(`${window.location.origin}/friends?user_id=${user.id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const json = await response.json();

    let lis = ''

    for(const friend of json.result){
        lis += `<li onclick="loadChat(${user.id}, ${friend.id}, '${friend.name}')" class="list-group-item">${friend.name}</li>`
    }

    document.getElementById('friends').innerHTML = lis;
}

const updateMessage = (type, message) => {
    let li = ''
    if(type === 1){
        li = chat1.replace('texto_aqui', message);
    }else{
        li = chat2.replace('texto_aqui', message);
    }
    const lis = document.getElementsByClassName('message-text');

    if(lis.length > 0){
        lis[lis.length - 1].insertAdjacentHTML('afterend', li);
    } else{
        messages.innerHTML = li;
    }
    
    
    document.getElementsByClassName('messages')[0].scrollTop = document.getElementsByClassName('messages')[0].scrollHeight;
}

document.getElementById('form-chat').addEventListener('submit', function(event) {
    event.preventDefault();

    const message_input = document.getElementById('message_input');
    const message = message_input.value;

    sendMessageSocket(message);
    updateMessage(1, message);

    message_input.value = '';
});

const sendMessageSocket = (message) => {
    const socket = io();

    socket.emit('SEND_MESSAGE', {
        user_sender: user.id,
        user_receptor: friend.id,
        message: message
    });
}

const ouvirMessage = () => {
    const socket = io();

    socket.on('RECEIVE_MESSAGE', function(data){
        if(data.user_sender === friend.id){
            updateMessage(2, data.message);
        }
    });
}

ouvirMessage();
getFriends();