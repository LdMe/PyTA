


const TemplateListItem = ({template,getTemplate}) => {
    console.log(template)
    return (
        <li>
            <a onClick={() =>getTemplate(template._id.$oid)}>{template.name}</a>
        </li>
    );
}

export default TemplateListItem;