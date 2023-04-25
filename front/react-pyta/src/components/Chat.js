/*
Componente que muestra una conversación entera, con todos los mensajes que contiene, los mensajes son de clase 'user','assistant' y 'system'
*/
import React, { useState, useEffect } from 'react';
import 'highlight.js/scss/vs2015.scss';
//import 'highlight.js/scss/googlecode.scss';

import axios from 'axios';

import Message from './Message';
import MessageForm from './MessageForm';

const Chat = ({ chatName }) => {
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
        </section>
    );
};

export default Chat;


