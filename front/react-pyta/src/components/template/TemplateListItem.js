import axios from 'axios';

const TemplateListItem = ({template,getTemplate,deleteTemplate}) => {
    
    return (
        <li title={"Plantilla:\n---\n"+template.content+"\n---\npalabra a reemplazar: \n---\n"+template.replace_word+"\n---\n"} >
            <a className="chat-link" onClick={() =>getTemplate(template._id.$oid)}>{template.name}</a>
            <button onClick={()=>deleteTemplate(template)}><i className="fas fa-trash-alt" title="Eliminar conversación"></i></button>
        </li>
    );
}

export default TemplateListItem;