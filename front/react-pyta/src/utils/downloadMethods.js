import jsPDF from "jspdf";
import { renderToStaticMarkup } from 'react-dom/server';

const downloadAsMarkdown = (chatName,chat) => {
    console.log(chat)
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
    const pdf = new jsPDF('p', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    
    const highlight = Array.from(document.querySelectorAll('div.assistant')).map((element) => element.outerHTML)
    
    const html =renderToStaticMarkup(
        <div style={{"width":`${width * 2.5  -100}px`, "margin": "auto"}}>
         <style>
            {`
            .assistant{
                padding: 5px;
                background-color: #fff;
            }
            * {
                vertical-align: baseline;
                padding-bottom: 5px;
            }
            `}
            
            </style>   
            {highlight.map((element) => <div dangerouslySetInnerHTML={{__html: element}}></div>)}
        </div>
        );
    await pdf.html(html, {
        callback: function (pdf) {
            
        },
        autoPaging: 'text',
        margin: [12, 6, 15, 8],
        html2canvas: { scale: 0.4 },

    });
    
    element.href = pdf.output('bloburl');
    element.id="downloadPDF";
    element.download = `${chatName}.pdf`;
    document.body.appendChild(element); // Required for this to work in FireFox
    
    element.click();
    document.body.removeChild(element);



}

export {downloadAsMarkdown, downloadAsPDF};