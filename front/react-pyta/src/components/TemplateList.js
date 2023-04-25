/* 
Componente templateList que muestra una lista de templates sacados del backend
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TemplateListItem from './TemplateListItem';
import Template from './Template';

const TemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState('');
    const [currentTemplate, setTemplate] = useState(null);

    // Obtener lista de templates desde el backend
    useEffect(() => {
        axios.get('http://localhost:5500/api/templates')
        .then(response => {
            setTemplates(response.data)
        })
        .catch(error => console.log(error))
    }
    , []);
    

    // Función para crear un nuevo template
    const handleNewTemplate = event => {
        event.preventDefault();
        axios.post('http://localhost:5500/api/create-template', { title: newTemplate })
        .then(response => {
            setTemplates([...templates, response.data]);

            setNewTemplate('');
        })
        .catch(error => console.log(error))
    }
    const getTemplate = (id) => {
        const template = templates.find(template => template._id.$oid === id);
        setTemplate(template);
    }
    const clearTemplate = () => {
        setTemplate(null);
    }

    const templateList = <section>
        <h2>Plantillas</h2>
        <ul id="lista-links">
            {templates.map(template => <TemplateListItem  key={template._id.$oid} template={template}  getTemplate={getTemplate} />)}
        </ul>
        <form onSubmit={handleNewTemplate} className="new-conversation">
            <input type="text" value={newTemplate} onChange={event => setNewTemplate(event.target.value)} placeholder="Escribe el título del nuevo template" />
            <button type="submit">Crear nuevo template</button>
        </form>
        </section>;
    return (
        currentTemplate ?  <section className="chat"><Template template={currentTemplate} onClick={clearTemplate}/></section>: templateList
    );
}

export default TemplateList;

