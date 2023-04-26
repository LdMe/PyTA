/*

Componente index, donde aparece el título, una imagen, la lista de chats y un input para crear un chat nuevo
La lista de chats se obtiene del backend, y se actualiza cada vez que se crea un nuevo chat
*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ChatListItem from './ChatListItem';
import Chat from './Chat';
import Navbar from './NavBar';
import TemplateList from './TemplateList';

const Index = () => {
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState('');
  const [chatName, setChatName] = useState(null);
  const [navButtons, setNavButtons] = useState([]);

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
  const addNavButton = (button) => {
    setNavButtons([...navButtons, button]);
  };
  const chatList = <section>
        <h1>PyTA</h1>
        <h2>Tu asistente inteligente</h2>
        <img src="/img/pyta.png" alt="Imagen" className="main-image"/>
        <ul id="lista-links">
            {chats.map(chat => <ChatListItem  key={chat} chat={chat}  getChat={getChat} />)}
        </ul>
        <form onSubmit={handleNewChat} className="new-conversation">
            <input type="text" value={newChat} onChange={event => setNewChat(event.target.value)} placeholder="Escribe el título del nuevo chat" />
            <button type="submit">Crear nuevo chat</button>
        </form>
        <TemplateList />
        </section>;

  return (
    <div>
      <header>
        <Navbar navButtons={navButtons}/>
      </header>
      <main>
        <section>
          {chatName ?  <Chat chatName={chatName} addNavButton={addNavButton}/>: chatList}
        </section>
      </main>
    </div>
    
    
  );
};

export default Index;