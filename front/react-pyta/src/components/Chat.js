/*
Componente que muestra una conversación entera, con todos los mensajes que contiene, los mensajes son de clase 'user','assistant' y 'system'
*/
import React, { useState, useEffect } from 'react';

import Message from './Message';
import 'highlight.js/styles/vs2015.css';


const Chat = ({ chat }) => {
    return (
        <section className="chat">
            
            {chat.map(message => {
                return <Message key={message._id.$oid} message={message} shadow={message.role === 'nothing' ? 'shadow' : ''} />}
            )}
        </section>
    );
};

export default Chat;
