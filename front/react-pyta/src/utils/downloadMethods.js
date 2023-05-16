import jsPDF from "jspdf";
import { renderToStaticMarkup } from 'react-dom/server';

const downloadAsMarkdown = (chatName,chat) => {
    const text = chat.filter(message => message.role === 'assistant').map(message => message.content).join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${chatName}.md`;
    element.id = 'downloadMD';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);

}
const downloadAsPDF = async(chatName) => {
    
    const element = document.createElement('a');
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
        compress: true,
    });
    const width = pdf.internal.pageSize.getWidth();
    let messages = Array.from(document.querySelectorAll('div.assistant'));
    messages = messages.map((element) => {
        // add span tags to text inside pre tags and not inside span tags
        let code = Array.from(element.querySelectorAll('code')) ;
        if (code){
            code = code.map((element) => {
                const text = element.innerHTML.split("\n")
                const newText = text.reduce((acc, line, index) => {
                    line = `<span class="line">${line}</span>\n`
                    acc += line;
                    return acc;
                }, '');
                element.innerHTML = newText;
                return element;
            })
        }
        

        return element.outerHTML;
    })
    const html =renderToStaticMarkup(
        <div style={{"width":`${width * 2  -70}px`, "margin": "auto"}}>
         <style>
            {`
            * {
                font-family: sans-serif;
            }
            .assistant{
                padding: 5px;
                background-color: #fff;

            }
            .line {
                position: relative;
                margin: 0;
                padding: auto;
                width: 100%;
            }
            img {
                max-width: 100%;
                margin: auto;
            }
            strong {
                font-weight: bold;
                line-height: 1.4;
            }
            `}
            
            </style>   
            {messages.map((element) => <div dangerouslySetInnerHTML={{__html: element}}></div>)}
        </div>
        );
    // download html
    const element2 = document.createElement('a');
    const file = new Blob([html], {type: 'text/html'});
    element2.href = URL.createObjectURL(file);
    element2.download = `${chatName}.html`;
    element2.id = 'downloadHTML';
    document.body.appendChild(element2); // Required for this to work in FireFox
    element2.click();
    document.body.removeChild(element2);

    await pdf.html(html, {
        callback: function (pdf) {
            
        },
        autoPaging: 'text',
        margin: [12, 12, 15, 12],
        html2canvas: { scale: 0.5 },

    });
    
    element.href = pdf.output('bloburl');
    element.id="downloadPDF";
    element.download = `${chatName}.pdf`;
    document.body.appendChild(element); // Required for this to work in FireFox
    
    element.click();
    document.body.removeChild(element);



}

export {downloadAsMarkdown, downloadAsPDF};