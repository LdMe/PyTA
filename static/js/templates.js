

async function getTemplates(){
    let response = await fetch('/api/templates');
    let data = await response.json();
    return data;
}
async function addTemplate(name, template, replace_word){
    let response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            content: template,
            replaceWord: replace_word
        })
    });
    let data = await response.json();
    return data;
}
function renderTemplates(){
    getTemplates().then(templates => {
        createTemplatesHtml(templates);
        createNewTemplateForm();
    });
}
function createTemplatesHtml(templates){
    document.getElementById('templates').innerHTML = '';
    templates.forEach(template => {
        createTemplateHtml(template);
    });
}
function createTemplateHtml(template){
    const templateSection = document.createElement('section');
    templateSection.setAttribute('id', template.name);
    templateSection.setAttribute('class', 'template');
    const templateName = document.createElement('h3');
    templateName.innerText = template.name;
    const templateContent = document.createElement('section');
    
    const parts = template.content.split(template.replace_word);
    const pContent = document.createElement('p');
    parts.forEach(part => {
        const partElement = document.createElement('span');
        partElement.innerText = part;
        pContent.appendChild(partElement);
        if (part !== parts[parts.length - 1]) {
            const replaceWordElement = document.createElement('code');
            replaceWordElement.classList.add('hljs','bold');
            replaceWordElement.innerText = template.replace_word;
            pContent.appendChild(replaceWordElement);
        }

    });
    templateContent.appendChild(pContent);

    const templateDeleteButton = document.createElement('button');
    templateDeleteButton.setAttribute('id', 'delete');
    templateDeleteButton.classList.add('fas', 'fa-trash-alt');
    templateDeleteButton.title = 'Eliminar plantilla';
    templateDeleteButton.addEventListener('click', deleteTemplate);
    templateSection.appendChild(templateDeleteButton);
    templateSection.appendChild(templateName);
    templateSection.appendChild(templateContent);
    document.getElementById('templates').appendChild(templateSection);
}
async function deleteTemplate(event){
    const templateId = event.target.parentNode.id;
    const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
    });
    renderTemplates();
}
async function createNewTemplateForm(){
    const form = document.createElement('form');
    form.setAttribute('id', 'newTemplateForm');
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name');
    nameLabel.innerText = 'Nombre';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', 'templateName');
    nameInput.setAttribute('id', 'name');
    const contentLabel = document.createElement('label');
    contentLabel.setAttribute('for', 'content');
    contentLabel.innerText = 'Contenido';
    const contentInput = document.createElement('textarea');
    contentInput.setAttribute('name', 'content');
    contentInput.setAttribute('id', 'content');
    const replaceWordLabel = document.createElement('label');
    replaceWordLabel.setAttribute('for', 'replaceWord');
    replaceWordLabel.innerText = 'Palabra a reemplazar';
    const replaceWordInput = document.createElement('input');
    replaceWordInput.setAttribute('type', 'text');
    replaceWordInput.setAttribute('name', 'replaceWord');
    replaceWordInput.setAttribute('id', 'replaceWord');
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('id', 'submit');
    submitButton.classList.add('fas', 'fa-save');
    submitButton.title = 'Guardar plantilla';
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(contentLabel);
    form.appendChild(contentInput);
    form.appendChild(replaceWordLabel);
    form.appendChild(replaceWordInput);
    form.appendChild(submitButton);

    form.onsubmit = async (event) => {
        event.preventDefault();
        if (form.content.value === '') {
            return false;
        }
        await addTemplate(form.templateName.value, form.content.value, form.replaceWord.value);
        renderTemplates();
    };
    document.getElementById('templates').appendChild(form);
}

renderTemplates();