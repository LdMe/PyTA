
import { useState } from "react";

const Template = ({ template, onClick}) => {
    const content = template.content.replace(template.replace_word, "______");
    return (
        <section className=" pointer" onClick={onClick}>
            <h1>{template.name}</h1>
            <p>{content}</p>
        </section>
    );
}

export default Template;