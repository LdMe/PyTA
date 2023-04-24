/*
Componente que muestra una conversación entera, con todos los mensajes que contiene, los mensajes son de clase 'user','assistant' y 'system'
*/
import React, { useState, useEffect } from 'react';
import 'highlight.js/scss/vs2015.scss';
import axios from 'axios';

import Message from './Message';
import MessageForm from './MessageForm';

const Chat = ({ chatName }) => {
    const [chat, setChat] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);

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
    const addMessage = (message) => {
            axios.put(`http://localhost:5500/api/chat/${chatName}`, {
                content: content,
                role: role
            })
            .then(response => {
                console.log(response.data);
                const temporalMessage  = {...message};
                temporalMessage.content = content ? content : message.content;
                temporalMessage.role = role ? role : message.role;
                setMessage(temporalMessage);
            });
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
            <MessageForm onSubmit={getChat} />
        </section>
    );
};

export default Chat;


