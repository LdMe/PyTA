/*
Componente que muestra una conversación entera, con todos los mensajes que contiene, los mensajes son de clase 'user','assistant' y 'system'
*/
import React, { useState, useEffect,useRef } from 'react';
import 'highlight.js/scss/vs2015.scss';
//import 'highlight.js/scss/googlecode.scss';
import { renderToStaticMarkup,renderToString } from 'react-dom/server';
import axios from 'axios';
import jsPDF from 'jspdf';

import Message from '../message/Message';
import MessageForm from '../message/MessageForm';
import Navbar from './NavBar';
import Modal from '../modal/Modal';
import '../../css/Chat.css';
import {getChat as getC,deleteMessage as deleteM, addMessage as addM,swapMessages as swapM, ask} from '../../utils/chat';
import { downloadAsMarkdown as downloadMD, downloadAsPDF as downloadPDF } from '../../utils/downloadMethods';


const Chat = ({ chatName ,goBack}) => {
    const [chat, setChat] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(true);

    const lastMessage = useRef(null);
    useEffect(() => {
        getChat();
        document.title = `PyTA ${chatName}`;
        
    }, []);
    useEffect(() => {
        if (lastMessage.current){
            if(hasNewMessage){
                lastMessage.current.scrollIntoView({ behavior: 'smooth' });
                setHasNewMessage(false);
            }
        }
    }, [chat]);

    const getChat= async() =>{
        setLoading(true);
        const response = await getC(chatName);
        setChat(response);
        setLoading(false);

    };
    const deleteMessage = async (messageId) => {
        const response =await deleteM(chatName,messageId);
        setChat(response);

    };
    const addMessage = async(message) => {
        const response = await addM(chatName,message);
        if(response){
        setChat(response);
        setHasNewMessage(true);
        }

    };
    const downloadAsMarkdown = () => {
        downloadMD(chatName,chat);

    }
    
    const downloadAsPDF = async(event) => {
        event.preventDefault();
        console.log("downloading")
        setDownloading(true);
        await downloadPDF(chatName,chat);
        setDownloading(false);
        setHasNewMessage(true);
        goBack(true);
    }
    const swapMessages = async (draggingIndex,targetIndex) => {
        const response = await swapM(chatName,draggingIndex,targetIndex);
        setChat(response);
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
    const handleSend = async(message) =>{
       
        await addMessage(message);
        console.log(lastMessage.current)
        lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        setLoading(true);
        const response = await ask(chatName);
        setChat(response);
        setLoading(false);
        setHasNewMessage(true);

    }
    
    if (!chat) {
        return <h1>Cargando...</h1>;
    }
    const shadow = chat.role === 'nothing'  || dragging ? 'shadow' : '';
    
    return (
        <section className="chat">
            {downloading && <Modal show={true}><h1>Descargando...</h1></Modal>}
            <main>
                <h1 >Conversación {chatName}</h1>
                {chat.map((message,index) => {
                    return <Message 
                    key={message._id.$oid} 
                    onDelete={()=>deleteMessage(message._id.$oid)} 
                    chatName={chatName} 
                    originalMessage={message}
                    shadow={shadow} 
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}

                    />}
                    
                )}
                <span ref={lastMessage}></span>
                {loading ? <Modal show={true}>
                    <img src='/img/thinking.gif' alt='loading' className="main-image"></img>
                    <h1>Pensando...</h1></Modal> : 
                    <MessageForm  onSubmit={addMessage} onSend={handleSend} />
                }
                
            </main>
            <footer >
                <Navbar navButtons={[
                    {icon: "fa-home", onClick:goBack,title:"Inicio"},
                    {icon:"fa-paper-plane", onClick:() =>handleSend(null),title:"Enviar mensajes"},
                    {icon:"fa-file-arrow-down", onClick: downloadAsMarkdown,title:"Descargar como Markdown"},
                    {icon:"fa-file-pdf ", onClick: downloadAsPDF,title:"Descargar como PDF"},
                ]}/>
            </footer>
        </section>
    );
};

export default Chat;


