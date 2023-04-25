
import { useState } from "react";

const Template = ({ template, onClick}) => {

    return (
        <section className="message system" onClick={onClick}>
            <h1>{template.name}</h1>
            <p>{template.content}</p>
        </section>
    );
}

export default Template;