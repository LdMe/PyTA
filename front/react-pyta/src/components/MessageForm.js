/*
formulario para crear o modificar un mensaje
contiene  el textarea para escribir el mensaje, un select para elegir el rol, otro select para elegir plantilla o sin plantilla, y un botón para guardar el mensaje. En caso de crear uno nuevo, también aparecerá un botón para enviarlo una vez guardado

*/

import  { useState, useEffect } from 'react';

const MessageForm = ({ message, onSubmit, onCancel,onSend }) => {
    const [templates, setTemplates] = useState([]);
    const [newMessage, setNewMessage] = useState({content: "", role: "user"});

    useEffect(() => {
        if(message) return;
        fetch('http://localhost:5500/api/templates')
            .then(response => response.json())
            .then(data => setTemplates(data));
    }, []);
    const handleRoleChange = (event) => {
        const form = event.target.form;
        // add class to form to change the color of the message depending on the role
        form.classList.remove('user', 'assistant', 'system','new');
        form.classList.add(event.target.value);
    };
    const handleCancel = (event) => {
        event.preventDefault();
        
        setNewMessage({content: "", role: "user"});
        if (onCancel){
            onCancel();
        }
    };

    let templateSelector = null;
    let className = "new " + (message ? "" : 'message'); 
    let sendButton = null;
    if(message){
        className += " " + message.role;
    }else{
        className += " " + newMessage.role;
        sendButton = <button type="submit" className="fas fa-paper-plane" onClick={onSend} title="enviar mensaje" ></button>;
    }
    if(!message){
        templateSelector = (
            <select name="template" >
                <option value="">Sin plantilla</option>
                {templates.map(template => (
                    <option key={template.name} value={template.name} title={"Plantilla:\n---\n"+template.content+"\n---\npalabra a reemplazar: \n---\n"+template.replace_word+"\n---\n"}>{template.name} </option>
                ))}
            </select>);
    }
    return (
        <section className={className}>
            <form className="message-form" id="message-form" >
                <textarea name="content" placeholder="Escribe tu mensaje aquí" defaultValue={message ? message.content : newMessage.content}></textarea>
                <select name="role" defaultValue={message ? message.role : newMessage.role} onChange={handleRoleChange}>
                    <option value="user">Usuario</option>
                    <option value="assistant">PyTA</option>
                    <option value="system">Sistema</option>
                </select>
                {templateSelector}
                <button type="submit" className='fas fa-save' onClick={onSubmit} title="guardar mensaje"></button>
                <button type="button" className="fas fa-times" onClick={handleCancel} title="cancelar" ></button>
                {sendButton}
            </form>
        </section>
    );
}

export default MessageForm;

