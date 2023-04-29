/*
Componente que muestra un mensaje, con su contenido y su clase
*/
import MarkdownView from 'react-showdown';
import Highlight from 'react-highlight';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState } from 'react';
import axios from 'axios';

import {updateMessage as updateM,createMessage as createM} from '../../utils/message';
import MessageButtons from './MessageButtons';
import MessageForm from './MessageForm';
import '../../css/Message.css';

const Message = ({ originalMessage,chatName,shadow ,moving, handleDrag,handleDrop, onDelete}) => {
    const [edit, setEdit] = useState(false);
    const [selected,setSelected] = useState(false);
    const [message,setMessage] = useState(originalMessage);
    
    const handleMouseEnter = (e) => {
        if (shadow){
            e.target.closest('.message').classList.add('selected');
        }
    };
    const handleMouseOut = (e) => {
        if (shadow){
            if (!selected){
                e.target.closest('.message').classList.remove('selected');
            }
        }
    };
    const handleEdit = () => {
        setEdit(true);
    };
    const handleDelete = () => {
        const id = message._id.$oid;
        onDelete(id);
    };
    const handleSubmit = (message) => {
        
        updateMessage(message);
        setEdit(false);
    };

    const handleClick = () => {
        if (moving){
            const  id = message._id.$oid;
            handleDrop(id);
            setSelected(false);
        }
    }; 
    const handleDragStart = () => {
        if (!moving){
            const  id = message._id.$oid;
            handleDrag(id);
            setSelected(true);
            
        }
    };
    const updateMessage = ( message) => {
        updateM(chatName,message)
        .then(response => {
            const temporalMessage  = response.find(m => m._id.$oid === message._id.$oid);
            console.log(temporalMessage)
            setMessage(temporalMessage);
            
        })
        .catch(error => console.log(error))
    };

       
    const className = `message ${message.role} ${shadow}` + (selected ? ' selected' : '');
    if (edit){
        return (
            <section className={className} id={message._id.$oid}>
                <article>
                    <MessageForm message={message} onSubmit={handleSubmit} onCancel={() => setEdit(false)} />
                </article>
            </section>
        );
    }
    let html = renderToStaticMarkup(<MarkdownView markdown={message.content} className={message.role} />);
    // find text inside ` and ` and replace it with <code>...</code>
    //html = html.replace(/`([^`]+)`/g, '<codes className="inline-code">$1</codes>');
    return (
        <section  className={className} id={message._id.$oid} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut} onClick={handleClick}>
            <article>
                <MessageButtons message={message} handleDrag={handleDragStart} handleEdit={handleEdit} handleDelete={handleDelete}/>
                <Highlight  innerHTML={true}>
                    {html}
                </Highlight>
            </article>
        </section>
    );
};

export default Message;