/*
Componente que genera los botones de los mensajes, con sus respectivas funciones
1- Botón para poder arrastrar el mensaje a la posición de otro mensaje
2- Botón para poder editar el mensaje
3- Botón para poder eliminar el mensaje
*/
import { useState } from 'react';


const MessageButtons = ({ handleDrag, handleEdit, handleDelete }) => {
    return (
        <div className="message-buttons">
            <button onClick={handleDrag} className='fas fa-arrows-alt' title="Arrastrar mensaje"></button>

            <button onClick={handleEdit} className="fas fa-edit" title="Editar mensaje"></button>
            <button onClick={handleDelete} className="fas fa-trash-alt" title="Eliminar mensaje"></button>
        </div>
    );
}

export default MessageButtons;