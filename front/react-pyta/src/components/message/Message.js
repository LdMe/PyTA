/*
Componente que muestra un mensaje, con su contenido y su clase
*/
import MarkdownView from 'react-showdown';
import Highlight from 'react-highlight';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState } from 'react';
import axios from 'axios';

import MessageButtons from './MessageButtons';
import MessageForm from './MessageForm';
import '../../css/Message.css';

const Message = ({ originalMessage,chatName,shadow , handleDrag,handleDrop, onDelete}) => {
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
        
        updateOrCreateMessage(message);
        setEdit(false);
    };

    const updateOrCreateMessage = (content,role) => {
        if(message._id){
            updateMessage(content,role);
        }
        else{
            createMessage(content,role);
        }

    };

    const handleClick = () => {
        if (shadow){
            const  id = message._id.$oid;
            handleDrop(id);
            setSelected(false);
        }
    }; 
    const handleDragStart = () => {
        if (!shadow){
            const  id = message._id.$oid;
            handleDrag(id);
            setSelected(true);
            
        }
    };
    const updateMessage = ( message) => {
        const content = message.content;
        const role = message.role;
        axios.put(`http://localhost:5500/api/chat/${chatName}/update/${message._id.$oid}`, {
            content: content ? content : message.content,
            role: role ? role : message.role
        })
        .then(response => {
            const temporalMessage  = {...message};
            temporalMessage.content = content ? content : message.content;
            temporalMessage.role = role ? role : message.role;
            setMessage(temporalMessage);
            
        })
        .catch(error => console.log(error))
    };

    const createMessage = ( content, role) => {
        axios.put(`http://localhost:5500/api/chat/${chatName}`, {
            content: content,
            role: role
        })
        .then(response => {
            const temporalMessage  = {...message};
            temporalMessage.content = content ? content : message.content;
            temporalMessage.role = role ? role : message.role;
            setMessage(temporalMessage);
        });
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