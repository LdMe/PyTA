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
import MaxWordsInput from './maxWordsInput';
import '../../css/Chat.css';
import {getChat as getC,deleteMessage as deleteM, addMessage as addM,swapMessages as swapM, ask,getLastMessagesByWordCount} from '../../utils/chat';
import { downloadAsMarkdown as downloadMD, downloadAsPDF as downloadPDF } from '../../utils/downloadMethods';


const Chat = ({ chatName ,goBack}) => {
    const [chat, setChat] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(true);
    const [maxWords, setMaxWords] = useState(1000);
    const lastMessage = useRef(null);
    const [lastMessages,setLastMessages] = useState([]);

    useEffect(() => {
        getChat();
        document.title = `${chatName} PyTA`;
        
    }, []);
    useEffect(() => {
        if (lastMessage.current){
            if(hasNewMessage){
                lastMessage.current.scrollIntoView({ behavior: 'smooth' });
                setHasNewMessage(false);
            }
        }
        
    }, [chat]);
    useEffect(() => {
        setLastMessages(getLastMessages());
    }, [chat,maxWords]);

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
        lastMessage.current.scrollIntoView({ behavior: 'smooth' });
        setLoading(true);
        const response = await ask(chatName,maxWords);
        setChat(response);
        setLoading(false);
        setHasNewMessage(true);

    }
    const getLastMessages= () =>{
        const response = getLastMessagesByWordCount(chat,maxWords);
        return  response;
    }
    if (!chat) {
        return <h1>Cargando...</h1>;
    }
    const shadow = chat.role === 'nothing'  || dragging ? 'shadow' : '';
    const moving = dragging ? true : false;
    return (
        <section className="chat">
            {downloading && <Modal show={true}><h1>Descargando...</h1></Modal>}
            <main>
                <h1 >Conversación {chatName}</h1>
                {chat.map((message,index) => {
                    const messageShadow = shadow || lastMessages && lastMessages.findIndex(
                        (lastMessage) => lastMessage._id.$oid === message._id.$oid) ==-1 ? 'shadow' : '';
                    return <Message 
                    key={message._id.$oid} 
                    onDelete={()=>deleteMessage(message._id.$oid)} 
                    chatName={chatName} 
                    originalMessage={message}
                    shadow={messageShadow} 
                    moving={moving}
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}

                    />}
                    
                )}
                <span ref={lastMessage}></span>
                {loading ? 
                    <Modal show={true}>
                        <img src='/img/thinking.gif' alt='loading' className="main-image"></img>
                        <h1>Pensando...</h1>
                    </Modal> : 
                    <MessageForm  onSubmit={addMessage} onSend={handleSend} />
                }
                
            </main>
            <footer >
                <Navbar key={1} navButtons={[
                    {icon: "fa-home", onClick:goBack,title:"Inicio"},
                    {icon:"", onClick:() => {},title:`${maxWords} palabras`,html : 
                    <MaxWordsInput key={1} maxWords={maxWords} onSubmit={setMaxWords}/>
                    },
                    {icon:"fa-paper-plane", onClick:() =>handleSend(null),title:"Enviar mensajes"},
                    {icon:"fa-file-arrow-down", onClick: downloadAsMarkdown,title:"Descargar como Markdown"},
                    {icon:"fa-file-pdf ", onClick: downloadAsPDF,title:"Descargar como PDF"},
                ]}/>
            </footer>
        </section>
    );
};

export default Chat;


