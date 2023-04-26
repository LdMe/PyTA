
db.templates.insertMany([
    {
        content:"Explica detalladamente <tema>. Muestra ejemplos de código y casos de uso.",
        replace_word:"<tema>",
        name: "Teoría"
    },
    {
        content:"Crea ejercicios sobre <tema>. Los ejercicios deben ser sencillos y se deben presentar como una solución a un problema real.",
        replace_word:"<tema>",
        name:"Ejercicios"
    },
    {
        content:"Corrige el siguiente código:\n\n <tema>\n\n Explica por qué el código no funciona y cómo se puede arreglar.",
        replace_word:"<tema>",
        name:"Corrección"
    },
    {
        content:"Explica lo que hace el siguiente código\n\n```js\n\n<codigo>\n\n```",
        replace_word:"<codigo>",
        name:"Explicación"
    },
    {
        content:"Eres profesor de programación full stack. Explica detalladamente los temas mencionados y muestra ejemplos de código si es necesario. Las respuestas deben ir en formato markdown, y el código en el formato correspondiente",
        replace_word:"<codigo>",
        name:"Contexto profesor full stack",
    }
]);