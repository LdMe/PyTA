

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
    console.log(template);
    const templateDiv = document.createElement('div');
    templateDiv.setAttribute('id', template._id);
    const templateName = document.createElement('h3');
    templateName.innerText = template.name;
    const templateContent = document.createElement('p');
    templateContent.innerText = template.content;
    const templateReplaceWord = document.createElement('p');
    templateReplaceWord.innerText = template.replace_word;
    const templateDeleteButton = document.createElement('button');
    templateDeleteButton.setAttribute('id', 'delete');
    templateDeleteButton.innerText = 'Delete';
    templateDeleteButton.addEventListener('click', deleteTemplate);
    templateDiv.appendChild(templateName);
    templateDiv.appendChild(templateContent);
    templateDiv.appendChild(templateReplaceWord);
    templateDiv.appendChild(templateDeleteButton);
    document.getElementById('templates').appendChild(templateDiv);
}
async function deleteTemplate(event){
    const templateId = event.target.parentNode.id;
    const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
    });
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
    submitButton.innerText = 'Submit';
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
        console.log("form submitted")
        await addTemplate(form.templateName.value, form.content.value, form.replaceWord.value);
        renderTemplates();
    };
    document.getElementById('templates').appendChild(form);
}

renderTemplates();