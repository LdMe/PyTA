/*
Elemento que representa um item da lista de conversaciones, cada uno tiene su título y un botón para poder eliminarlo
*/

import React from 'react';
import axios from 'axios';

const ChatListItem = ({ chat ,getChat}) => {

  // Función para eliminar un chat
  const handleDeleteChat = () => {
    axios.delete(`/api/chat/${chat}`)
      .then(response => console.log(response))
      .catch(error => console.log(error))
  };

  return (
    <li >
      <a className="chat-link" onClick={()=>getChat(chat)}>{chat}</a>
      
      <button onClick={handleDeleteChat}><i className="fas fa-trash-alt" title="Eliminar conversación"></i></button>
    </li>
  );
};

export default ChatListItem;