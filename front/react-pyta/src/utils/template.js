import axios from "axios";
const HOST_URL = `http://${process.env.REACT_APP_BACKEND_IP ? process.env.REACT_APP_BACKEND_IP : 'localhost'}:5500/api`;

const getTemplates = () => {
    return new Promise((resolve,reject)=>{
    axios.get(`${HOST_URL}/templates`)
        .then(response => {
            resolve(response.data)
        })
        .catch(error => reject(error));
    });
};

const createTemplate = (template) => {
    return new Promise((resolve,reject)=>{
        axios.post(`${HOST_URL}/templates`, 
        { name: template.name ,
            content: template.content,
            replaceWord: template.replaceWord
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
};

const deleteTemplate = (template) => {
    return new Promise((resolve,reject)=>{
        axios.delete(`${HOST_URL}/templates/${template.name}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => reject(error));
    });
};


export {
    getTemplates,
    createTemplate,
    deleteTemplate
}