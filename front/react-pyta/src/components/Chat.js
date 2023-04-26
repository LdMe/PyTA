/*
Componente que muestra una conversación entera, con todos los mensajes que contiene, los mensajes son de clase 'user','assistant' y 'system'
*/
import React, { useState, useEffect } from 'react';
import 'highlight.js/scss/vs2015.scss';
//import 'highlight.js/scss/googlecode.scss';
import { renderToStaticMarkup,renderToString } from 'react-dom/server';
import axios from 'axios';
import jsPDF from 'jspdf';

import Highlight from 'react-highlight';

import Message from './Message';
import MessageForm from './MessageForm';
import MarkdownView from 'react-showdown';


const Chat = ({ chatName ,addNavButton}) => {
    const [chat, setChat] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const getChat=() =>{
        setChat(null);
        axios.get(`http://localhost:5500/api/chat/${chatName}`)
        .then(response => {
            console.log(response.data);
            setChat(response.data);
        })
        .catch(error => console.log(error))
    };
    const deleteMessage = (messageId) => {
        axios.delete(`http://localhost:5500/api/chat/${chatName}/delete/${messageId}`)
        .then(response => {
            console.log(response.data);
            getChat();
        })
        .catch(error => console.log(error))
    };
    const addMessage = (event) => {
        event.preventDefault();
        const form = event.target.form;
        const formData = new FormData(form);
        const message = Object.fromEntries(formData);
        const content = message.content;
        if (!content) return;
        const role = message.role;
        axios.post(`http://localhost:5500/api/chat/${chatName}/add`, {
                content: content,
                role: role
        })
        .then(response => {
                console.log(response.data);
                getChat();
                });
    };
    const setMessage = (message) => {
        setChat([...chat, message]);
    };
    const addDownloadButton = () => {
        if (document.getElementById('download')) return;
        const downloadButton = <li id="download" className="nav-link"><a className="fas fa-download" onClick={downloadAsPDF}></a></li>;
        addNavButton(downloadButton);
        
    };
    const downloadAsMarkdown = () => {
        const text = chat.filter(message => message.role === 'assistant').map(message => message.content).join('\n');
        
        const element = document.createElement('a');
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${chatName}.md`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

    }

    const downloadAsPDF = async() => {
        console.log("chat",chat)
        const text = chat.filter(message => message.role === 'assistant').map(message => message.content).join('\n');
        const element = document.createElement('a');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const html1 = renderToString(
            <MarkdownView markdown={text}  />); 
        
        const highlight = Array.from(document.querySelectorAll('div.assistant')).map((element) => element.outerHTML)
        console.log(highlight);
        const html =renderToStaticMarkup(
            <div style={{"width":`${width * 5  -100}px`, "margin": "auto"}}>
             <style>
                {`
                .assistant{
                    padding: 5px;
                    background-color: #fff;
                }
                pre {
                    padding: 5px;
                }
                * {
                    vertical-align: baseline;
                }
                `}
                
                </style>   
                {highlight.map((element) => <div dangerouslySetInnerHTML={{__html: element}}></div>)}
            </div>
            );
        await pdf.html(html, {
            callback: function (pdf) {
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
    const swapMessages = (draggingIndex,targetIndex) => {
        if(draggingIndex === targetIndex) return;
        axios.put(`http://localhost:5500/api/chat/${chatName}/swap/${draggingIndex}/${targetIndex}`)
        .then(response => {
            console.log(response.data);
            getChat();
        })
        .catch(error => console.log(error))
    };
    const handleDrag = (id) => {
        if(!dragging){
            setDragging(true);
            setDraggingIndex(id);
        }
    }
    const handleDrop = (id) => {
        setDragging(false);
        swapMessages(draggingIndex,id);
    }
    const handleSend = (event) =>{
        addMessage(event);
        setLoading(true);
        axios.post(`http://localhost:5500/api/chat/${chatName}`, {
                numWords: 1000
        })
        .then(response => {
                console.log(response.data);
                getChat();
                setLoading(false);
                });
    }
    useEffect(() => {
        getChat();
        addDownloadButton();
    }, []);
    if (!chat) {
        return <h1>Cargando...</h1>;
    }
    const shadow = chat.role === 'nothing'  || dragging ? 'shadow' : '';
    
    return (
        <section className="chat">
            {chat.map(message => {
                return <Message 
                key={message._id.$oid} 
                onDelete={deleteMessage} 
                chatName={chatName} 
                originalMessage={message}
                shadow={shadow} 
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                 />}
            )}
            {loading ? <h1>Esperando a la respuesta...</h1> : 
            <MessageForm onSubmit={addMessage} onSend={handleSend} />}
        <li id="download" className="nav-link"><a className="fas fa-download" onClick={downloadAsPDF}>download</a></li>
        </section>
    );
};

export default Chat;


