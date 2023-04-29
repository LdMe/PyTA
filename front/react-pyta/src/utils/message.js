import axios from 'axios'

const HOST_URL = `http://${process.env.REACT_APP_BACKEND_IP ? process.env.REACT_APP_BACKEND_IP : 'localhost'}:5500/api`;

const updateMessage = (chatName,message) => {
    console.log("messaje",message)
    return new Promise((resolve,reject)=>{
        axios.put(`${HOST_URL}/chat/${chatName}/update/${message._id.$oid}`, {
                    content: message.content,
                    role: message.role
                })
                .then(response => {
                    console.log("response",response.data)
                    resolve(response.data);
                    
                })
                .catch(error => reject(error));
    });
};

const createMessage = (chatName,message) => {
    return new Promise((resolve,reject)=>{
        axios.put(`${HOST_URL}/chat/${chatName}`, {
            content: message.content,
            role: message.role
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });   
};





export {
    updateMessage,
    createMessage
}