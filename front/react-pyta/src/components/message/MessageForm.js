/*
formulario para crear o modificar un mensaje
contiene  el textarea para escribir el mensaje, un select para elegir el rol, otro select para elegir plantilla o sin plantilla, y un botón para guardar el mensaje. En caso de crear uno nuevo, también aparecerá un botón para enviarlo una vez guardado

*/

import  { useState, useEffect,useRef } from 'react';

const MessageForm = ({ message, onSubmit, onCancel,onSend }) => {
    const [templates, setTemplates] = useState([]);
    const [newMessage, setNewMessage] = useState({content: "", role: "user",template:""});
    const formRef = useRef(null);
    useEffect(() => {
        if(message) {
            setNewMessage(message);
            return;
        }
        fetch('http://localhost:5500/api/templates')
            .then(response => response.json())
            .then(data => setTemplates(data));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSubmit){
            onSubmit(newMessage);
        }
        resetForm();
    };
    const handleRoleChange = (event) => {
        setNewMessage({...newMessage, role: event.target.value});
    };
    const handleTemplateChange = (event) => {
        setNewMessage({...newMessage, template: event.target.value});
    };
    const resetForm =() => {
        setNewMessage({content: "", role: "user",template:""});
    }
    const handleCancel = (event) => {
        event.preventDefault();
        resetForm();
        if (onCancel){
            onCancel();
        }
    };
    const handleSend = (event) => {
        event.preventDefault();
        if (onSend){
            onSend(newMessage);
        }
    };

    let templateSelector = null;
    let className = "new " + (message ? "" : 'message'); 
    let sendButton = null;
    if(message){
        className += " " + message.role;
    }else{
        className += " " + newMessage.role;
        sendButton = <button type="submit" className="fas fa-paper-plane" onClick={handleSend} title="enviar mensaje" ></button>;
    }
    if(!message){
        templateSelector = (
            <select name="template" onChange={handleTemplateChange} value={newMessage.template}>
                <option value="">Sin plantilla</option>
                {templates.map(template => (
                    <option key={template.name} value={template.name} title={"Plantilla:\n---\n"+template.content+"\n---\npalabra a reemplazar: \n---\n"+template.replace_word+"\n---\n"}>{template.name} </option>
                ))}
            </select>);
    }
    return (
        <section className={className}>
            <form className={"message-form " +newMessage.role} id="message-form" onSubmit={handleSubmit} ref={formRef}>
                <textarea name="content" placeholder="Escribe tu mensaje aquí" value={newMessage.content} onChange={(event) => setNewMessage({...newMessage, content: event.target.value})}></textarea>
                <select name="role" value={newMessage.role} onChange={handleRoleChange}>
                    <option value="user">Usuario</option>
                    <option value="assistant">PyTA</option>
                    <option value="system">Sistema</option>
                </select>
                {templateSelector}
                <button type="submit" className='fas fa-save'  title="guardar mensaje"></button>
                <button type="button" className="fas fa-times" onClick={handleCancel} title="cancelar" ></button>
                {sendButton}
            </form>
        </section>
    );
}

export default MessageForm;

