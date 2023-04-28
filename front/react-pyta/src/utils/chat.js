import axios from 'axios';

const getChat=(chatName) =>{
    return new Promise((resolve,reject)=>{
    axios.get(`http://localhost:5500/api/chat/${chatName}`)
    .then(response => {
        resolve(response.data);
    })
    .catch(error => reject(error));
    });
};

const deleteMessage = (chatName,messageId) => {
    console.log("delete");
    return new Promise((resolve,reject)=>{
    axios.delete(`http://localhost:5500/api/chat/${chatName}/delete/${messageId}`)
    .then(response => {
        console.log (response.data);
        resolve(response.data);
    })
    .catch(error => reject(error));
    });
};

const addMessage = (chatName,message) => {
    return new Promise((resolve,reject)=>{
        if (!message) {
            const form = document.forms[document.forms.length-1];
            console.log("form",form)
            const content = form.elements["content"].value;
            const role = form.elements["role"].value;
            const template = form.elements["template"].value;
            message = {content:content,role:role,template:template};

        }
        const content = message.content;
        const template = message.template;
        if (!content && template==="") return;
        const role = message.role;
        axios.post(`http://localhost:5500/api/chat/${chatName}/add`, {
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
        axios.put(`http://localhost:5500/api/chat/${chatName}/swap/${draggingIndex}/${targetIndex}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
};
const ask = (chatName) =>{
    return new Promise((resolve,reject)=>{
        
        axios.post(`http://localhost:5500/api/chat/${chatName}`, {
                numWords: 1000
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
}
export  {getChat,deleteMessage,addMessage,swapMessages,ask};