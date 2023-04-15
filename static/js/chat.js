

class Chat {
    constructor(chat_name){
        this.chat_name = chat_name;
        this.messages = [];
        this.formatted_messages = [];
        this.wordCountValue = 1000;
        this.converter = new showdown.Converter();
    }
    getChatName() {
        return this.chat_name;
    }

    async getMessages() {
        const chat_name = this.getChatName();
        const response = await fetch('/api/chat/' + chat_name);
        this.messages = await response.json();
        this.messages = this.messages.map(message => {
            message._id = message._id["$oid"];
            return message;
        });
        
        return this.messages;
    }

    async saveMessages() {
        const chat_name = this.getChatName();
        const response = await fetch('/api/chat/' + chat_name + '/save', { 
            method: 'POST' ,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: this.messages
            })
        });
        const data = await response.json();
        return data;
    }

    async getFormattedMessages() {
        this.formatted_messages = [];
        for (let i = 0; i < this.messages.length; i++) {
            this.formatted_messages.push(this.formatMessage(this.messages[i]));
        }
        return this.formatted_messages;
    }

    formatMessage(message) {
        
        const formatted_message = {
            content: this.converter.makeHtml(message.content),
            role: message.role,
            _id: message._id
        };
        return formatted_message;
    }

    downloadMessages() {
        const chat_name = this.getChatName() + '.md';
        const content = this.messages.filter(chat => chat.role == 'assistant').map(chat => chat.content).join("\n\n");
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', chat_name);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    getLastMessagesByWordCount() {
        let lastMessages = [];
        let wordCountTotal = 0;
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const message = this.messages[i];
            const messageWordCount = message.content.split(' ').length;
            if (wordCountTotal + messageWordCount <= this.wordCountValue) {
                lastMessages.push(message);
                wordCountTotal += messageWordCount;
            } else {
                break;
            }
        }
        return lastMessages;
    }
    async addMessage(content, role,template="default") {
        const chat_name = this.getChatName();
        if (content.length != 0 ){
            await fetch('/api/chat/' + chat_name, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    role: role,
                    template: template
                })
            });
        }
        
    }
    async sendMessage() {
        
        const chat_name = this.getChatName();
        const response = await fetch('/api/chat/' + chat_name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wordCount: this.wordCountValue
                })
        });
        const data = await response.json();
        return data;
    }

    async updateMessage(id, content, role) {
        const chat_name = this.getChatName();
        const response = await fetch('/api/chat/' + chat_name + '/update/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                role: role
            })
        });
        const data = await response.json();

        return data;
    }
    async deleteMessage(id) {
        const chat_name = this.getChatName();
        const response = await fetch('/api/chat/' + chat_name + '/delete/' + id, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    }
    setWordCount(wordCount) {
        this.wordCountValue = wordCount;
    }

    async getTemplates() {
        const response = await fetch('/api/templates');
        const data = await response.json();
        return data;
    }

    
}

export default Chat;