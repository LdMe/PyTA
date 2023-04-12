db.teoria.insertOne({
    content:"Explica detalladamente <tema>. Muestra ejemplos de código y casos de uso.",
    replace_word:"<tema>",
});

db.ejercicios.insertOne({
    content:"Crea ejercicios sobre <tema>. Los ejercicios deben ser sencillos y se deben presentar como una solución a un problema real.",
    replace_word:"<tema>",
});

db.correccion.insertOne({
    content:"Corrige el siguiente código:\n\n <tema>\n\n Explica por qué el código no funciona y cómo se puede arreglar.",
    replace_word:"<tema>",
});

