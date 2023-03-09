# PyTA - Python Teaching Assistant

PyTA es un asistente de enseñanza de Python que utiliza la API de OpenAI para proporcionar respuestas relevantes y personalizadas a las consultas de enseñanza. 

## Puesta en marcha
Para poder poner en marcha el programa PyTA, se deben seguir los siguientes pasos:

1. Instalar las librerías necesarias. Para esto, se puede usar el gestor de paquetes `pip` y ejecutar el siguiente comando: `pip install -r requirements.txt`. Este archivo `requirements.txt` especifica las librerías y sus versiones necesarias para poder utilizar PyTA.

2. Es necesario contar con credenciales de OpenAI para usar PyTA. Para ello, se debe crear una cuenta en la plataforma y generar una clave de API y una organización. Estas credenciales se deben guardar en un archivo .env en la raíz del proyecto. El archivo .env debe tener el siguiente formato:

```
OPENAI_API_KEY=<llave_de_api>
OPENAI_ORGANIZATION=<nombre_de_la_organizacion>
```

Donde `<llave_de_api>` y `<nombre_de_la_organizacion>` deben ser reemplazados con las credenciales correspondientes.

3. Crear las carpetas `input` y `output`. Estas carpetas son necesarias para guardar los archivos de código fuente que se desean corregir y para guardar los resultados de las correcciones, respectivamente. Se pueden crear de la siguiente manera:

```bash
mkdir input
mkdir output
```

Una vez realizados estos tres pasos, PyTA está listo para ser utilizado. Se puede ejecutar la opción interactiva de PyTA con el siguiente comando:

```
python3 main.py

```
----
## La función interactive

La función `interactive` permite al usuario crear clases o corregir ejercicios de forma interactiva, así como tomar decisiones sobre el nombre del archivo, si el archivo es un ejercicio y si se desea añadir contenido al final del archivo. Esta función se llama por defecto al ejecutar el archivo `main.py`.

### Uso de la función interactive

Las opciones que puede escoger el usuario son las siguientes:

1. Para crear clases:
- `¿Quieres crear clases o corregir ejercicios? (clases/corregir)`: el usuario debe ingresar "clases" .
- `¿Qué tema quieres tratar?`: el usuario debe ingresar el tema que desea tratar en la clase.
- `¿Cómo quieres llamar al archivo?`: el usuario debe ingresar el nombre que desea dar al archivo que contendrá la clase.
- `¿Es un ejercicio? (s/n)`: el usuario debe indicar si la clase es un ejercicio o no ingresando "s" o "n".
- `¿Quieres añadir al final del archivo? (s/n)`: el usuario debe indicar si desea añadir el contenido de la clase al final del archivo existente o sustituirlo ingresando "s" o "n".

2. Para corregir ejercicios:
- `¿Quieres crear clases o corregir ejercicios? (clases/corregir)`: el usuario debe ingresar "corregir" .
- No se requiere ingresar información adicional.

La opción de crear clases generará un archivo .md en la carpeta `output` con el contenido de la clase. La opción de corregir ejercicios generará un archivo por cada ejercicio que se encuentre en la carpeta `input` y lo guardará en la carpeta `output` con el mismo nombre y formato que el archivo de entrada.
**Aviso: la correción de ejercicios no es muy precisa, pero puede servir como guía para corregir los ejercicios. Es conveniente que los ejercicios a corregir incluyan el enunciado en el comentario de la primera línea del archivo, ya que PyTA utilizará este enunciado como base para generar la respuesta.**

En ambos casos, luego de realizar la acción correspondiente se le pregunta al usuario si desea hacer algo más ingresando "s" o "n". Si el usuario elige "s", se le muestra las opciones para la acción anterior y se le permite realizar una nueva acción. Si elige "n", la función finaliza.

Además, la función permite la opción de recordar las últimas decisiones del usuario en un diccionario llamado "last_choices" para que en la siguiente interacción las opciones anteriores aparezcan como sugerencias al usuario. Para usar las opciones sugeridas, el usuario debe presionar la tecla "Enter" sin ingresar ningún valor.


### Pasar opciones por defecto a la función interactive

Si queres pasar opciones por defecto a la función `interactive`, se puede hacer de la siguiente manera:

```python
last_choices = {
    'class_or_correct': 'clases',
    'theme': 'tema_por_defecto',
    'filename': 'archivo_por_defecto',
    'is_exercise': 'n',
    'append': 'n'
}
assitant = PyTA()
assistant.interactive(last_choices)
```

De esta manera, el usuario puede definir opciones por defecto y reutilizarlas en diferentes ejecuciones de la función.

Además, la función `create_classes` se puede llamar directamente para crear una clase de teoría o ejercicio sin tener que interactuar con el usuario:

```python
assistant.create_classes("decoradores", "decorators", is_exercise=False, append=False)
``` 

En este ejemplo, se crea una clase de teoría sobre decoradores con el nombre de archivo `decorators`. El archivo no se añadirá al final de un archivo existente, ya que `append=False`.


----

## Cambiar el contexto y las frases por defecto

El contexto se usa para preparar a PyTA para un uso específico. Por ejemplo, el contexto por defecto es "Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en el formato correspondiente.".  

Sin embargo, es posible cambiar este contexto para adaptarlo a diferentes temas o usos.

Para cambiar el contexto, basta con modificar la variable `CONTEXT` al inicio del código (`pyTA.py`). Por ejemplo:

```python
CONTEXT = "Eres un profesor del bootcamp de machine learning. Las respuestas deben ir en formato markdown y el código en el formato correspondiente."
```

Además, PyTA utiliza algunas frases por defecto para generar texto para la corrección de ejercicios y la creación de clases. Estas frases también pueden ser modificadas para adaptarse a diferentes temas o usos. En particular, se pueden modificar las siguientes variables:

- `THEORY`: frase para la creación de teoría.
- `EXERCISES`: frase para la creación de ejercicios.
- `CORRECT`: frase para la corrección de ejercicios.

Por ejemplo, para modificar la frase para la creación de teoría en el contexto de machine learning:

```python
THEORY = "Explica detalladamente <tema> desde la perspectiva de machine learning. Muestra ejemplos de algoritmos y casos de uso."
```

En resumen, se pueden cambiar tanto el contexto como las frases por defecto de PyTA para adaptarlo a diferentes temas o usos simplemente modificando las variables correspondientes al inicio del código.

---

## Sugerencias de mejoras y colaboración

Si tienes alguna sugerencia de mejoras o quieres colaborar con el proyecto, puedes abrir un issue en el repositorio de GitHub. Este proyecto no está hecho con ambiciones comerciales, el objetivo es que sea una herramienta útil para la comunidad educativa.