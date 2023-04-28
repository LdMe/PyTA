/*

Componente index, donde aparece el título, una imagen, la lista de chats y un input para crear un chat nuevo
La lista de chats se obtiene del backend, y se actualiza cada vez que se crea un nuevo chat
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ChatListItem from './chat/ChatListItem';
import Chat from './chat/Chat';
import TemplateList from './TemplateList';
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
    setChatName(newChat);
  };
  const getChat = (chat_name) => {
    setChatName(chat_name);
  };
  const chatList = <section>
        <h1>PyTA</h1>
        <h2>Tu asistente inteligente</h2>
        <img src="/img/pyta.png" alt="Imagen" className="main-image"/>
        <h2>Conversaciones</h2>
        <ul id="lista-links">
            {chats.map(chat => <ChatListItem  key={chat} chat={chat}  getChat={getChat} />)}
        </ul>
        <form onSubmit={handleNewChat} className="new-conversation ">
            <input type="text" value={newChat} onChange={event => setNewChat(event.target.value)} placeholder="Escribe el título del nuevo chat" />
            <button type="submit" title="crear una nueva conversación">Crear nuevo chat</button>
        </form>
        <TemplateList />
        </section>;

  return (
    <div >
      <main>
        <section>
          {chatName ?  <Chat chatName={chatName} goBack={()=>setChatName(null)} />: chatList}
        </section>
      </main>
    </div>
    
    
  );
};

export default Index;