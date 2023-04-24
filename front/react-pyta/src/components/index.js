/*

Componente index, donde aparece el título, una imagen, la lista de chats y un input para crear un chat nuevo
La lista de chats se obtiene del backend, y se actualiza cada vez que se crea un nuevo chat
*/

import React, { useState, useEffect } from 'react';
import ChatListItem from './ChatListItem';
import Chat from './Chat';
import axios from 'axios';

const Index = () => {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState('');
  const [chatName, setChatName] = useState(null);

  // Obtener lista de chats desde el backend
  useEffect(() => {
    axios.get('http://localhost:5500/api/chats')
      .then(response => {
        setChats(response.data)
      })
      .catch(error => console.log(error))
  }, []);

  // Función para crear un nuevo chat
  const handleNewChat = event => {
    event.preventDefault();
    axios.post('http://localhost:5500/api/create-chat', { title: newChat })
      .then(response => {
        setChats([...chats, response.data]);
        setNewChat('');
      })
      .catch(error => console.log(error))
  };
  const getChat = (chat_name) => {
    setChatName(chat_name);
  };
  const chatList = <section>
        <h1>PyTA</h1>
        <h2>Tu asistente inteligente</h2>
        <img src="img/pyta.png" alt="Imagen" className="main-image"/>
        <ul id="lista-links">
            {chats.map(chat => <ChatListItem  key={chat} chat={chat}  getChat={getChat} />)}
        </ul>
        <form onSubmit={handleNewChat} className="new-conversation">
            <input type="text" value={newChat} onChange={event => setNewChat(event.target.value)} placeholder="Escribe el título del nuevo chat" />
            <button type="submit">Crear nuevo chat</button>
        </form>
        </section>;
  return (
    chatName ?  <Chat chatName={chatName}/>: chatList
  );
};

export default Index;