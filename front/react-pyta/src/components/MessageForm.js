/*
formulario para crear o modificar un mensaje
contiene  el textarea para escribir el mensaje, un select para elegir el rol, otro select para elegir plantilla o sin plantilla, y un botón para guardar el mensaje. En caso de crear uno nuevo, también aparecerá un botón para enviarlo una vez guardado

*/

import React, { useState, useEffect } from 'react';

const MessageForm = ({ message, onSubmit, onCancel }) => {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        if(message) return;
        fetch('http://localhost:5500/api/templates')
            .then(response => response.json())
            .then(data => setTemplates(data));
    }, []);
    let templateSelector = null;
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
        <section className="message new">
            <form className="message-form" id="message-form" onSubmit={onSubmit}>
                <textarea name="content" placeholder="Escribe tu mensaje aquí" defaultValue={message ? message.content : ""}></textarea>
                <select name="role" defaultValue={message ? message.role : 'user'}>
                    <option value="user">Usuario</option>
                    <option value="assistant">PyTA</option>
                    <option value="system">Sistema</option>
                </select>
                {templateSelector}
                <button type="submit">Guardar</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </form>
        </section>
    );
}

export default MessageForm;

