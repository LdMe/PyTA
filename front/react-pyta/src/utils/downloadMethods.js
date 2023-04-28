import jsPDF from "jspdf";
import { renderToStaticMarkup } from 'react-dom/server';

const downloadAsMarkdown = (chatName,chat) => {
    console.log(chat)
    const text = chat.filter(message => message.role === 'assistant').map(message => message.content).join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${chatName}.md`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

}
const downloadAsPDF = async(chatName) => {
    const element = document.createElement('a');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    
    const highlight = Array.from(document.querySelectorAll('div.assistant')).map((element) => element.outerHTML)
    const html =renderToStaticMarkup(
        <div style={{"width":`${width * 5  -100}px`, "margin": "auto"}}>
         <style>
            {`
            .assistant{
                padding: 5px;
                background-color: #fff;
            }
            * {
                vertical-align: baseline;
                padding-bottom: 5px;
                letter-spacing: 0.1px;
            }
            `}
            
            </style>   
            {highlight.map((element) => <div dangerouslySetInnerHTML={{__html: element}}></div>)}
        </div>
        );
    await pdf.html(html, {
        callback: function (pdf) {
            const pageCount = pdf.internal.getNumberOfPages(); //Total Page Number
            
            pdf.save(`${chatName}.pdf`);
        },
        autoPaging: 'text',
        margin: [12, 6, 15, 8],
        html2canvas: { scale: 0.2 },

    });
    
    element.href = pdf.output('bloburl');

    element.download = `${chatName}.pdf`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

}

export {downloadAsMarkdown, downloadAsPDF};