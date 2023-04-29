import { useState } from 'react';
import Template from './Template';

const TemplateListItem = ({template,deleteTemplate}) => {
    const [showingTemplate, setShowingTemplate] = useState(false);
    const html = showingTemplate ? 
        <li><Template template={template} onClick={() =>setShowingTemplate(false)} /></li> 
        : 
        <li title={"Plantilla:\n---\n"+template.content+"\n---\npalabra a reemplazar: \n---\n"+template.replace_word+"\n---\n"} >
            <a className="chat-link" onClick={() =>setShowingTemplate(true)}>{template.name}</a>
            <button className="fas fa-trash-alt" onClick={()=>deleteTemplate(template)} title="Eliminar plantilla"></button>
        </li>
    ;

    return (
        html

    );
}

export default TemplateListItem;