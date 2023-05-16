/*
Elemento que representa um item da lista de conversaciones, cada uno tiene su título y un botón para poder eliminarlo
*/

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { deleteChat } from '../../utils/chat';

const ChatListItem = ({ chat ,getChat,onDelete}) => {

  // Función para eliminar un chat
  const handleDeleteChat =  () => {
    deleteChat(chat);
    onDelete(chat);
  };

  return (
    
    <li>
      
      <Link to={`/chat/${chat}`} style={{ textDecoration: 'none' }} className="chat-link" onClick={()=>getChat(chat)}>
      {chat}
      </Link>
      <button onClick={handleDeleteChat} className="fas fa-trash-alt" title="Eliminar conversación"></button>
      
    </li>
  );
};

export default ChatListItem;