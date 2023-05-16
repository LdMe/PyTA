import axios from 'axios';

const HOST_URL = `http://${process.env.REACT_APP_BACKEND_IP ? process.env.REACT_APP_BACKEND_IP : 'localhost'}:5500/api`;

const getChats = () => {
    console.log("url",`${HOST_URL}`)
    return new Promise((resolve,reject)=>{
    axios.get(`${HOST_URL}/chats`)
      .then(response => {
            resolve(response.data);
      })
      .catch(error => reject(error));
    });
};
const getChat=(chatName) =>{
    return new Promise((resolve,reject)=>{
    axios.get(`${HOST_URL}/chat/${chatName}`)
    .then(response => {
        resolve(response.data);
    })
    .catch(error => reject(error));
    });
};
const deleteChat = (chatName) => {
    return new Promise((resolve,reject)=>{
    axios.delete(`${HOST_URL}/chat/${chatName}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
    });
};
const deleteMessage = (chatName,messageId) => {
    return new Promise((resolve,reject)=>{
    axios.delete(`${HOST_URL}/chat/${chatName}/delete/${messageId}`)
    .then(response => {
        resolve(response.data);
    })
    .catch(error => reject(error));
    });
};

const addMessage = (chatName,message) => {
    return new Promise((resolve,reject)=>{
        if (!message) {
            const form = document.forms[document.forms.length-2];
            const content = form.elements["content"].value;
            const role = form.elements["role"].value;
            const template = form.elements["template"].value;
            message = {content:content,role:role,template:template};

        }
        const content = message.content;
        const template = message.template;
        if (!content && template==="") resolve(null);
        const role = message.role;
        axios.post(`${HOST_URL}/chat/${chatName}/add`, {
                content: content,
                role: role,
                template: template
        })
        .then(response => {
            resolve(response.data);
        }).catch(error => reject(error));
    });
};
const swapMessages = (chatName,draggingIndex,targetIndex) => {
    return new Promise((resolve,reject)=>{
        if(draggingIndex === targetIndex) return;
        axios.put(`${HOST_URL}/chat/${chatName}/swap/${draggingIndex}/${targetIndex}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
};
const ask = (chatName,wordCount=1000) =>{
    return new Promise((resolve,reject)=>{
        
        axios.post(`${HOST_URL}/chat/${chatName}`,
        {
            numWords: wordCount
        })
        .then(response => {
            console.log("responssa",response)
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
}

const getLastMessagesByWordCount = (chat,wordCount) =>{
    if (!chat) return [];
    let count = 0;
    let messages = [];
    for (let i = chat.length-1; i >= 0; i--) {
        const message = chat[i];
        const words = message.content.split(" ");
        count += words.length;
        if (count >= wordCount) break;
        messages.push(message);
    }
    messages = messages.reverse();
    return(messages);
};


export  {getChats,getChat,deleteChat,deleteMessage,addMessage,swapMessages,ask,getLastMessagesByWordCount};