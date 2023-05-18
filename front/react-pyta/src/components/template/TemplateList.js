/* 
Componente templateList que muestra una lista de templates sacados del backend
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TemplateListItem from './TemplateListItem';
import { getTemplates,createTemplate,deleteTemplate } from '../../utils/template';

const TemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState('');
    const [currentTemplate, setTemplate] = useState(null);

    // Obtener lista de templates desde el backend
    useEffect(() => {
        
        getTemplates()
        .then(response => {
            setTemplates(response)
        })
        .catch(error => console.log(error))
    }
    , []);
    

    // Función para crear un nuevo template
    const handleNewTemplate = event => {
        event.preventDefault();
        createTemplate(newTemplate)
        .then(response => {
            setTemplates(response);

            setNewTemplate({name: '', content: '', replaceWord: ''});
        })
        .catch(error => console.log(error))
    }
    const getTemplate = (id) => {
        const template = templates.find(template => template._id.$oid === id);
        setTemplate(template);
    }
    const handleDeleteTemplate = (template) => {
        deleteTemplate(template)
        .then(response => setTemplates(response))
        .catch(error => console.log(error))
    }
    const clearTemplate = () => {
        setTemplate(null);
    }

    const templateList = <section>
        <ul className="lista-links">
            {templates.map(template => <TemplateListItem  key={template._id.$oid} template={template}  deleteTemplate={handleDeleteTemplate} />)}
        </ul>
        <form onSubmit={handleNewTemplate} className="new-conversation">
            <input type="text" name="name" value={newTemplate.name} onChange={event => setNewTemplate(newTemplate=>({...newTemplate, name: event.target.value}))} placeholder="Escribe el título del nueva plantilla" title="título de la plantilla"/>
            <input type="text" name="replaceWord" value={newTemplate.replaceWord} onChange={event => setNewTemplate(newTemplate=>({...newTemplate, replaceWord: event.target.value}))} placeholder="Escribe la palabra o frase a reemplazar" title="palabra a reemplazar"/>
            <textarea type="text" name="content" value={newTemplate.content} onChange={event => setNewTemplate(newTemplate=>({...newTemplate, content: event.target.value}))} placeholder="Escribe el contenido" title="contenido de la plantilla. Reemplazará la palabra clave por el texto que se escriba en el mensaje. Si no hay coincidencias, solo se guardará el contenido de la plantilla" />
            
            <button type="submit"  title="crear una nueva plantilla">Crear nueva plantilla</button>
        </form>
        </section>;
    return (
        <section >

            <h2>Plantillas</h2>
            {templateList}
        </section>
    );
}

export default TemplateList;

