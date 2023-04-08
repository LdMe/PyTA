
let chats = [];
let formatted_chats = [];
// get the conversation name from the url
function getChatName() {
    const url = window.location.href;
    const chat_name = url.split('/').pop().replace('#', '');
    return chat_name;
}

// get all chats from server
async function getChats() {
    const chat_name = getChatName();
    const response = await fetch('/api/chats/' + chat_name);
    chats = await response.json();
    return chats;
}

// remove message from chat 
function removeMessage(position) {
    chats.splice(position, 1);
    document.getElementById('message-'+position).remove();
    const scrollPos= position  > 0 ? position - 1 : 0;
    render(reload=true,scrollPosition=scrollPos);
}

// form data for message update
function updateMessageForm(position) {
    const message = chats[position].content;
    const form = document.createElement('form');
    
    const section = document.createElement('section');
    const textarea = document.createElement('textarea');
    const select = document.createElement('select');
    textarea.type = 'text';
    textarea.name = 'message';
    textarea.value = message;
    form.appendChild(textarea);
    const option1 = document.createElement('option');
    option1.value = 'user';
    option1.text = 'Usuario';
    const option2 = document.createElement('option');
    option2.value = 'assistant';
    option2.text = 'PyTA';
    const option3 = document.createElement('option');
    option3.value = 'system';
    option3.text = 'Contexto';

    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    select.name = 'role';
    select.value = chats[position].role;
    form.appendChild(select);
    const saveButton = document.createElement('button');
    saveButton.type = 'submit';

    saveButton.classList.add('fas', 'fa-check');
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        updateMessage(position, form.message.value, form.role.value);
        return false;
    });
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-'+position;
    cancelButton.classList.add('fas', 'fa-times');
    
    cancelButton.addEventListener('click', () => updateMessage(position, message));
    
    const buttons = document.createElement('section');
    buttons.classList.add('buttons');
    buttons.appendChild(saveButton);
    buttons.appendChild(cancelButton);
    section.appendChild(buttons);
    section.appendChild(form);
    
    document.getElementById('message-'+position).innerHTML = '';
    document.getElementById('message-'+position).appendChild(section);
    
}
// update message in chat
function updateMessage(position, message, role=null) {
    chats[position].content = message;
    if (role != null) {
        chats[position].role = role;
    }
    render(reload=true,scrollPosition=position);
}

// add new message to chat
function addMessage(message,role) {
    chats.push({
        role: role,
        content: message
    });
}
// create loading message
function createLoadingMessage() {
    const div = document.createElement('div');
    div.className = 'message loading';
    div.id = 'loading';
    const img = document.createElement('img');
    img.src = '/static/img/loading.gif';
    div.appendChild(img);
    document.getElementById('chat').appendChild(div);
    div.scrollIntoView();
}
// remove loading message
function removeLoadingMessage() {
    document.getElementById('loading').remove();
}

// send messages to server to get response
async function sendMessages() {
    const chat_name = getChatName();
    const last_conversations = getLastConversations();
    const response = await fetch('/api/chats/' + chat_name, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(last_conversations)
    });
    return await response.json();
}

async function createMessagesHtml(reload=false) {
    if (!reload){
        await getChats();
    }

    let section = document.createElement('section');
    let lastConversations = getLastConversations();
    let len = lastConversations.length;
    for (let i = 0; i < chats.length; i++) {
        shadow = true;
        if (chats.length - i <= len) {
            shadow = false;
        }
        section.appendChild(createMessageHtml(chats[i], i,shadow));
    }
    // add highlight class to last message sections with id message-<i>

    return section;
}

// create html for single message
function createMessageHtml(chat, position,shadow=false) {
    const role = chat.role;
    const content = chat.content;
    const converter = new showdown.Converter();
    const html_content = converter.makeHtml(content);
    const chatContainer = document.getElementById('chat');
    const section = document.createElement('section');
    const scrollThreshold  = 180;

    section.classList.add('message', role);
    if (shadow == true) {
        section.classList.add('shadow');
    }
    section.id = 'message-'+position;

    const buttons = document.createElement('section');
    const dragIcon = document.createElement('i');
    dragIcon.classList.add('fas', 'fa-lock');
    section.appendChild(dragIcon);
    
    section.draggable = false;
    dragIcon.addEventListener('click', (event) => {
        section.draggable = !section.draggable;
        section.classList.toggle('draggable');
        dragIcon.classList.toggle('fa-lock');
        dragIcon.classList.toggle('fa-bars');

    });
    buttons.classList.add('buttons');

    const updateButton = document.createElement('i');
    updateButton.classList.add('fas', 'fa-edit');
    updateButton.addEventListener('click', () => updateMessageForm(position));

    const removeButton = document.createElement('i');
    removeButton.classList.add('fas', 'fa-trash');
    removeButton.addEventListener('click', () => removeMessage(position));

    buttons.appendChild(dragIcon);
    buttons.appendChild(updateButton);
    buttons.appendChild(removeButton);
    section.appendChild(buttons);
    section.addEventListener("dragstart", (event) => {
        // if click on drag icon position, set data to position, else do nothing
        console.log(event.target)
        if (section.draggable)
        {
            event.dataTransfer.setData("text/plain", position);
        }
      });
      // evento dragover
    section.addEventListener("dragover", (event) => {
        event.preventDefault();
        const messagePos = event.clientY;
        console.log(messagePos, scrollThreshold)
        if (messagePos <  scrollThreshold) {
            // scrollear hacia arriba
            window.scrollBy(0, -20);
        } else if (messagePos > window.innerHeight - scrollThreshold) {
            // scrollear hacia abajo
            window.scrollBy(0, 20);
        }
    });
      // evento drop
    section.addEventListener("drop", (event) => {
        event.preventDefault();
        const sourcePos = parseInt(event.dataTransfer.getData("text/plain"));
        const targetPos = position;
        if (sourcePos !== targetPos) {
          // cambiar orden de mensajes en el arreglo chats
          const sourceChat = chats[sourcePos];
          chats.splice(sourcePos, 1);
          chats.splice(targetPos, 0, sourceChat);
          render(reload = true); // renderizar de nuevo la conversación
        }
    });

    const article = document.createElement('article');
    article.innerHTML = html_content;
    section.appendChild(article);
    
    return section;

}

// create html for new message
function createNewMessageHtml() {
    const section = document.createElement('section');
    section.classList.add('message');
    const form = document.createElement('form');
    form.onsubmit = () => {
        if (form.message.value === '') {
            return false;
        }
        addMessage(form.message.value, form.role.value);
        send();
        return false;
    };
    const textarea = document.createElement('textarea');
    textarea.type = 'text';
    textarea.name = 'message';
    textarea.placeholder = 'Nuevo mensaje';
    form.appendChild(textarea);
    const select = document.createElement('select');
    select.name = 'role';
    select.id = 'role';
    const userOption = document.createElement('option');
    userOption.value = 'user';
    userOption.innerText = 'Usuario';
    const systemOption = document.createElement('option');
    systemOption.value = 'system';
    systemOption.innerText = 'Contexto';
    const assistantOption = document.createElement('option');
    assistantOption.value = 'assistant';
    assistantOption.innerText = 'PyTA';
    select.appendChild(userOption);
    select.appendChild(assistantOption);
    select.appendChild(systemOption);
    
    form.appendChild(select);
    // for each option in select
    select.addEventListener('change', (event) => {
        section.classList.remove('user', 'system', 'assistant');
        section.classList.add(select.value);
    });
    const input = document.createElement('input');
    input.type = 'submit';
    input.value = 'Enviar';
    form.appendChild(input);
    section.appendChild(form);
    return section;
}
function createNavbarLinks(){
    const navbarList = document.querySelector('#nav ul');

    const homeLink = document.createElement('li');
    const saveLink = document.createElement('li');
    const downloadLink = document.createElement('li');

    homeLink.innerHTML = '<a href="/">Inicio</a>';

    saveLink.innerHTML = '<a href="#" id="save">Guardar</a>';
    saveLink.addEventListener('click', () => saveChat());

    downloadLink.innerHTML = '<a href="#" id="download">Descargar</a>';
    downloadLink.addEventListener('click', () => downloadChat());

    navbarList.innerHTML = '';
    navbarList.appendChild(homeLink);
    navbarList.appendChild(saveLink);
    navbarList.appendChild(downloadLink);


}
// create html for all messages
async function createHtml(reload=false) {
    createNavbarLinks();
    const messagesHtml = await createMessagesHtml(reload);
    const newMessageHtml = createNewMessageHtml();

    document.getElementById('chat').innerHTML = '';
    document.getElementById('chat').appendChild(messagesHtml);
    document.getElementById('chat').appendChild(newMessageHtml);
}
async function saveChat(){
    const chat_name = getChatName();
    const response = await fetch('/api/chats/' + chat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chats)
    });
    return await response.json();
}
// función para obtener las últimas conversaciones cuya suma de contenidos no supere las 3000 palabras
function getLastConversations(numWords = 2000) {
    let sum = 0;
    let result = [];
    for (let i = chats.length - 1; i >= 0; i--) {
      const message = chats[i].content;
      const words = message.split(' ');
      sum += words.length;
      if (sum <= numWords) {
        result.push(chats[i]);
      } else {
        break;
      }
    }
    console.log(result);
    return result.reverse();
}
async function downloadChat(){
    const chat_name = getChatName() +".md";
    const content = chats.filter(chat => chat.role == 'assistant').map(chat => chat.content).join("\n");
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', chat_name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}



async function render(reload=false,scrollPosition=null) {
    await createHtml(reload);
    hljs.highlightAll();
    if (scrollPosition){
        document.getElementById("message-"+scrollPosition).scrollIntoView();
        window.scrollBy(0, -100);
    }
}

// send messages to server and render response
async function send() {
    createLoadingMessage();
    const response = await sendMessages();
    removeLoadingMessage();
    chats = response;
    const scrollPos = chats.length;
    render(scrollPosition=scrollPos);
}

// render messages on page load

render();