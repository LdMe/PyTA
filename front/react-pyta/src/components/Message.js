/*
Componente que muestra un mensaje, con su contenido y su clase
*/
import React from 'react';
import MarkdownView from 'react-showdown';
import Highlight from 'react-highlight';
import { renderToStaticMarkup } from 'react-dom/server';

const Message = ({ message,shadow }) => {
    const className = `message ${message.role} ${shadow}`;
    const html = renderToStaticMarkup(<MarkdownView markdown={message.content} className={message.role} />);
    return (
        <section className={className} id={message._id}>
            <article>
                <Highlight  innerHTML={true}>
                    {html}
                </Highlight>
            </article>
        </section>
    );
};

export default Message;