import Chat from './chat.js';

class ChatView {
    constructor(chat_name) {
        this.chat_name = chat_name;
        this.chat = new Chat(chat_name);
        this.scrollPosition = -1;
    }
    getPositionById(id) {
        return this.chat.messages.findIndex(message => message._id === id);
    }
    createDraggableMessage(message, id,shadow=false) {
        const role = message.role;
        const content = message.content;
        const section = this.createMessageHtml(id,content, role,  shadow);
        const scrollThreshold  = 180;
        const position = this.getPositionById(id);

        const buttons = section.querySelector('.buttons');
        const dragIcon = document.createElement('i');
        dragIcon.classList.add('fas', 'fa-lock');
        dragIcon.title = 'Arrastrar mensaje';
        buttons.insertBefore(dragIcon, buttons.firstChild);
        section.draggable = false;
        dragIcon.addEventListener('click', (event) => {
            section.draggable = !section.draggable;
            section.classList.toggle('draggable');
            dragIcon.classList.toggle('fa-lock');
            dragIcon.classList.toggle('fa-bars');
    
        });
        // evento dragstart
        section.addEventListener("dragstart", (event) => {
            // if click on drag icon position, set data to position, else do nothing

            if (section.draggable)
            {
                event.dataTransfer.setData("text/plain", this.getPositionById(section.id));
            }
          });
          // evento dragover
        section.addEventListener("dragover", (event) => {
            event.preventDefault();
            const messagePos = event.clientY;
            if (messagePos <  scrollThreshold) {
                // scrollear hacia arriba
                window.scrollBy(0, -20);
            } else if (messagePos > window.innerHeight - scrollThreshold) {
                // scrollear hacia abajo
                window.scrollBy(0, 20);
            }
        });
          // evento drop
        const self = this;
        section.addEventListener("drop", async (event) => {
            event.preventDefault();
            const sourcePos = parseInt(event.dataTransfer.getData("text/plain")); // 
            const targetPos = position;

            this.scrollPosition = position;
            // si una de las posiciones no es un número, no hacer nada
            if (isNaN(sourcePos) || isNaN(targetPos)) {
                return;
            }
            if (sourcePos !== targetPos) {
              // cambiar orden de mensajes en el arreglo messages
              const sourceChat = this.getMessageByPosition(sourcePos);
              const targetChat = this.getMessageByPosition(targetPos);
              this.chat.messages.splice(sourcePos, 1);
              this.chat.messages.splice(targetPos, 0, sourceChat);
              await this.saveMessages();
              this.render(true); // renderizar de nuevo la conversación
            }
        });
        section.addEventListener('dragenter', (event) => {
            section.classList.add('hover');
        });
        section.addEventListener('dragleave', (event) => {
            section.classList.remove('hover');
        });
        
        return section;
    
    }
    createMessageButtons(id) {
        const buttons = document.createElement('section');
        buttons.classList.add('buttons');
        buttons.id="buttons-"+ id;
        const updateButton = document.createElement('i');
        const removeButton = document.createElement('i');
        updateButton.classList.add('fas', 'fa-edit');
        updateButton.title = 'Editar mensaje';
        removeButton.classList.add('fas', 'fa-trash-alt');
        removeButton.title = 'Eliminar mensaje';
        updateButton.addEventListener('click', () => this.updateMessageForm(id));
        removeButton.addEventListener('click', () => this.deleteMessage(id));
        buttons.appendChild(updateButton);
        buttons.appendChild(removeButton);
        return buttons;
    }  
    createMessageHtml(id, content, role, shadow=false) {
        const section = document.createElement('section');
        section.classList.add('message', role);
        if (shadow == true) {
            section.classList.add('shadow');
        }
        section.id = id;
        const buttons = this.createMessageButtons(id);
        section.appendChild(buttons);
        const article = document.createElement('article');
        article.innerHTML = content;
        section.appendChild(article);
        
        return section;
    
    }
    createMessagesHtml() {
        const last_messages = this.chat.getLastMessagesByWordCount();
        const messageCount = last_messages.length;
        const totalCount = this.chat.messages.length;
        let counter = 0;
        const messagesHtml = Object.values(this.formatted).map((message) => {
            counter += 1;
            const id = message._id;
            const shadow = counter < totalCount - messageCount;
            return this.createDraggableMessage(message, id, shadow);
        });
        return messagesHtml;
    }
    async createMessageForm(message=null) {
        const position = message ? message._id : null;
        const form = document.createElement('form');
        form.id = 'message-form';
        const textarea = document.createElement('textarea');
        textarea.name = 'content';
        textarea.placeholder = 'Escribe tu mensaje';
        if (message) {
            textarea.value = message.content;
        }
        const selectRole = document.createElement('select');
        selectRole.name = 'role';

        const optionUser = document.createElement('option');
        const optionAssistant = document.createElement('option');
        const optionSystem = document.createElement('option');

        optionUser.value = 'user';
        optionAssistant.value = 'assistant';
        optionSystem.value = 'system';

        optionUser.innerHTML = 'Usuario';
        optionAssistant.innerHTML = 'Asistente';
        optionSystem.innerHTML = 'Sistema';

        selectRole.appendChild(optionUser);
        selectRole.appendChild(optionAssistant);
        selectRole.appendChild(optionSystem);

        if (message) {
            selectRole.value = message.role;
        }
        // listener bara el select, cuando se eliga un rol se ñade la clase a la seccion del mensaje
        selectRole.addEventListener('change', (event) => {
            const role = event.target.value;
            const id = message ? message._id : "message-new";
            const messageSection = document.getElementById(id);
            messageSection.classList.remove('user', 'assistant', 'system','new');
            messageSection.classList.add(role);
        });
        selectRole.title = 'Rol del mensaje';
        const selectTemplate = document.createElement('select');
        selectTemplate.name = 'template';
        selectTemplate.title = 'Plantilla';
        const optionDefault = document.createElement('option');
        optionDefault.value = 'default';
        optionDefault.innerHTML = 'Sin plantilla';
        selectTemplate.appendChild(optionDefault);
        const templates = await this.chat.getTemplates();
        templates.forEach((template) => {
            const option = document.createElement('option');
            option.value = template.name;
            option.innerHTML = template.name;
            option.title = "Plantilla:\n---\n"+template.content+"\n---\npalabra a reemplazar: \n---\n"+template.replace_word+"\n---\n";
            selectTemplate.appendChild(option);
        });
        const saveButton = document.createElement('button');
        const cancelButton = document.createElement('button');

        saveButton.classList.add('fas', 'fa-save');
        saveButton.title = 'Guardar mensaje';
        cancelButton.classList.add('fas', 'fa-times');
        cancelButton.title = 'Cancelar';
        saveButton.type = 'submit';
        saveButton.value = 'Enviar';

        
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (message){
                this.updateMessage(position, form.content.value, form.role.value);
            }
            else {
                this.addMessage(form.content.value, form.role.value, form.template.value);
            }
            return false;
        });
        if (message) {
            cancelButton.addEventListener('click', () => this.updateMessage(position, message));
        }
        else {
            cancelButton.addEventListener('click', () => this.render());

        }

        form.appendChild(textarea);
        form.appendChild(selectRole);
        form.appendChild(selectTemplate);
        form.appendChild(saveButton);
        form.appendChild(cancelButton);
        if (!message) {
            const sendButton = document.createElement('button');
            sendButton.classList.add('fas', 'fa-paper-plane');
            sendButton.value = 'Enviar';
            sendButton.addEventListener('click', async (event) => {
                event.preventDefault();
                if (form.content.value != "") {
                    await this.addMessage(form.content.value, form.role.value, form.template.value);
                    
                }
                await this.sendMessage();
                return false;
            });
            sendButton.title = 'Enviar mensajes';
            form.appendChild(sendButton);
        }

        return form;
    }
    async createNewMessageForm() {
        const form = await this.createMessageForm();
        const messages = document.getElementById('messages');
        const messageSection = document.createElement('section');
        messageSection.classList.add('message', 'new');
        messageSection.id = 'message-new';
        messageSection.appendChild(form);
        messages.appendChild(messageSection);

    }
    createNavButtons() {
        const old_nav_buttons = document.getElementById('nav-buttons');
        if (old_nav_buttons) {
            old_nav_buttons.remove();
        }

        const navButtons = document.createElement('ul');
        navButtons.id = 'nav-buttons';
        navButtons.classList.add('nav-buttons');
        
        const wordCountLink = document.createElement('li');
        wordCountLink.classList.add('nav-link');
        const wordCountLabel = document.createElement('label');
        wordCountLabel.innerHTML = 'Máximo de palabras: ';
        wordCountLabel.title = 'Limitar conversación a la cantidad de palabras indicada';
        wordCountLabel.classList.add("nav-link");
        const wordCountInput = document.createElement('input');
        wordCountInput.type = 'number';
        wordCountInput.name = 'wordCount';
        wordCountInput.value = this.chat.wordCountValue;
        wordCountInput.min = 200;
        wordCountInput.max = 3000;
        wordCountInput.step = 100;
        wordCountInput.addEventListener('change', (event) => {
            this.chat.setWordCount(event.target.value);
            this.render();
        });
        const nav = document.getElementById('nav');
        const saveLink = document.createElement('li');
        saveLink.classList.add('nav-link');
        const saveButton = document.createElement('button');
        saveButton.classList.add('fas', 'fa-file-arrow-down','nav-link');
        saveButton.title = 'Descargar respuestas';
        saveButton.value = 'Guardar';
        saveButton.addEventListener('click', async (event) => {
            event.preventDefault();
            this.chat.downloadMessagesAsPDF();
            return false;
        });
        wordCountLink.appendChild(wordCountLabel);
        wordCountLink.appendChild(wordCountInput);
        saveLink.appendChild(saveButton);
        navButtons.appendChild(wordCountLink);
        navButtons.appendChild(saveLink);
        nav.appendChild(navButtons);
        

    }
    async updateMessageForm(id) {
        const message = this.getMessage(id);
        const form = await this.createMessageForm(message);
        const messageSection = document.getElementById(id);
        messageSection.innerHTML = '';
        messageSection.appendChild(form);
    }
    getMessageByPosition(position) {
        return this.chat.messages[position];
    }
    getMessage(id) {
        // get message from array where _id = id
        return this.chat.messages.find((message) => message._id === id);
    }
    async addMessage(content, role, template="default") {
        await this.chat.addMessage(content, role, template);
        await this.render();
    }
    async sendMessage() {
        this.createLoadingMessage();
        try{
            await this.chat.sendMessage();
        }
        catch (error) {
            alert("Ha ocurrido un error al enviar el mensaje")
            console.log(error);
        }
        this.removeLoadingMessage();
        this.render();
    }
    async deleteMessage(id) {
        await this.chat.deleteMessage(id);
        this.render();
    }
    async updateMessage(id, content, role) {
        if (content) {
            await this.chat.updateMessage(id, content, role);
        }
        this.render();
    }
    async getMessages() {
         await this.chat.getMessages();
        this.formatted = {}
        const formattedList = await this.chat.getFormattedMessages();
        formattedList.forEach((message) => {
            this.formatted[message._id] = message;
        }
        );
    }

    async saveMessages() {
        await this.chat.saveMessages();
        await this.getMessages();
    }

    async render(reload = false) {
        await this.getMessages();
        this.createNavButtons();
        const messagesHtml = this.createMessagesHtml();
        const messagesSection = document.getElementById('messages');
        messagesSection.innerHTML = '';
        messagesHtml.forEach((messageHtml) => {
            messagesSection.appendChild(messageHtml);
        });
        await this.createNewMessageForm();
        hljs.highlightAll();
        this.scroll();
    }
    createLoadingMessage() {
        const div = document.createElement('div');
        div.className = 'message loading';
        div.id = 'loading';
        const img = document.createElement('img');
        img.src = '/static/img/loading.gif';
        div.appendChild(img);
        document.getElementById('messages').appendChild(div);
        div.scrollIntoView();
    }
    // remove loading message
    removeLoadingMessage() {
        document.getElementById('loading').remove();
    }
    scroll() {
        if (this.scrollPosition === -1){
            /* const message = document.getElementById('message-new');
            message.scrollIntoView();
            window.scrollBy(0, 100); */
        }
        else {
            const message = this.getMessageByPosition(this.scrollPosition);
            const messageElement = document.getElementById(message._id);
            messageElement.scrollIntoView();
            window.scrollBy(0, -100);
        }
        this.scrollPosition = -1;
    }
}

export default ChatView;