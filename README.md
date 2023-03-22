# PyTA - Python Teaching Assistant

                            /\
                            / \
                           /   \
                          /     \
                         /       \
                         |        |
                         ╭────────╮
                         |╭──────╮|
                     ╭────┤  ◕◕  ├────╮
                ╭────┤    | ╰┬┬╯ |    ├────╮
                │         | ╰┴┴╯ |         │
                │         ╰──────╯         │
                │     ──────╮  ╭──────     │
             ╭──┴───╮     ──│  │──     ╭───┴──╮
             │ │  │ │     ──│  │──     │ │  │ │
             │      │     ──│  │──     │      │
             │      │ ╰─────┴──┴─────╯ │      │
             │      ╰──────────────────╯      │
             ╰────────────────────────────────╯
       
PyTA es un asistente de enseñanza de Python que utiliza la API de OpenAI para proporcionar respuestas relevantes y personalizadas a las consultas de enseñanza. 

## Índice

- [Puesta en marcha](#puesta-en-marcha)
  - [Docker](#docker)
    - [Script](#script)
    - [Manual](#manual)
  - [Instalación con Python](#instalación-con-python)
- [Uso](#uso)
  - [Crear clases](#crear-clases)
  - [Corregir ejercicios](#corregir-ejercicios)
  - [Escribir libremente](#escribir-libremente)
  - [Cambiar contexto](#cambiar-contexto)
  - [Salir](#salir)
 - [Sugerencias de mejora / colaboración](#sugerencias-de-mejoras-y-colaboración)

---

## Puesta en marcha

---
### .env

El archivo `.env` contiene las credenciales de OpenAI y los textos por defecto que usa PyTA.
Es necesario contar con credenciales de OpenAI para usar PyTA. Para ello, se debe crear una cuenta en la plataforma y generar una clave de API y una organización. Estas credenciales se deben guardar en el archivo `.env` en la raíz del proyecto. El archivo `.env` debe tener el siguiente formato:

```
OPENAI_API_KEY=<clave_de_api>
OPENAI_ORGANIZATION=<ID_de_la_organizacion>
CONTEXT=<contexto>
THEORY=<teoria>
EXERCISES=<ejercicios>
CORRECTION=<correciones>

```
Filas:
  - `<clave_de_api>`: Clave de API de OpenAI.
  - `<ID_de_la_organizacion>`: ID de la organización de OpenAI.
  - `<contexto>`: Texto por defecto que se usa para el contexto.
  - `<teoria>`: Texto por defecto que se usa para la teoría. Pyta reemplazará la palabra clave `<tema>` por el tema de la clase.
  - `<ejercicios>`: Texto por defecto que se usa para los ejercicios. Pyta reemplazará la palabra clave `<tema>` por el tema de la clase.
  - `<correciones>`: Texto por defecto que se usa para las correcciones. Este se puede reemplazar para reaccionar de otra manera a la lectura de archivos (mejorar código, etc.).



Podemos usar el archivo [.env.example](.env.example) como plantilla.


- [ID de la organización](https://platform.openai.com/account/org-settings)
- [Clave de API](https://platform.openai.com/account/api-keys)

---

### Docker

Si tenemos Docker instalado, podemos crear y ejecutar PyTA con los siguientes comandos:

- #### Script

  - Se puede *instalar* en **linux** y **mac** con el siguiente comando:
  ```bash
  ./install.sh
  ```
  Este comando **creará un alias** para ejecutar PyTA con el comando `pyta` desde cualquier directorio. Los archivos creados seguirán guardándose en el directorio de PyTA.

  - Para desinstalar PyTA, se puede ejecutar el siguiente comando:
  ```bash
  ./uninstall.sh
  ```
  - Para ejecutar PyTA, se puede usar el siguiente comando:
  ```bash
  pyta
  ```
  - Si se cierra la terminal sin salir de PyTA, pueden quedar contenedores en marcha. Para eliminarlos, se puede ejecutar el siguiente comando:
  ```bash
  ./prune.sh
  ```

  - Los archivos creados por PyTA mediante Docker no se podrán modificar directamente, pero se pueden guardar con otro nombre o se puede recuperar el permiso de escritura con el siguiente comando:

  ```bash
  sudo chmod -R 777 output/<nombre_del_archivo_con_extension> 

  ```
---

- #### Manual

  Crear o actualizar la imagen:

  ```bash
  docker build -t pyta . // Crear la imagen
  ```
  Ejecutar la imagen:

  ```bash
  docker run --rm -v <directorio_de_PyTA>:/app -it pyta  // Ejecutar la imagen
  ```


---

### Instalación con Python
Para poder poner en marcha el programa PyTA, se deben seguir los siguientes pasos:

1. Tener instalado Python 3.10 o superior.

2. Instalar las librerías necesarias. Para esto, se puede usar el gestor de paquetes `pip` y ejecutar el siguiente comando: 

```bash
pip install -r requirements.txt
```

 Este archivo `requirements.txt` especifica las librerías y sus versiones necesarias para poder utilizar PyTA.

Una vez realizados estos pasos, PyTA está listo para ser utilizado. Se puede ejecutar la opción interactiva de PyTA con el siguiente comando:

```
python3 main.py

```
----
## Uso
---

La ejecución del código anterior ejecutará una función interactiva que nos mostrará las opciones disponibles para el usuario. Las opciones escogidas se guardan para la siguiente iteración.  
```
-------------
¿Qué quieres hacer?
1: Crear clases
2: Corregir ejercicios
3: Escribir libremente
4: Cambiar contexto
5: Salir
Elige una opción: 

```
### Crear clases

La opción 1 permite al usuario crear clases de forma interactiva. El usuario debe ingresar el tema que desea tratar en la clase y el nombre del archivo que contendrá la clase. Luego, PyTA generará una clase con el contenido correspondiente al tema ingresado. El usuario puede elegir si la clase es un ejercicio o no, y si desea añadir el contenido de la clase al final del archivo existente o sustituirlo. El archivo con el contenido de la clase se guardará en la carpeta `output` con el nombre especificado por el usuario. Se puede cambiar la frase usada para crear la clase en el archivo `PyTA.py` modificando las constantes `THEORY` y `EXERCISES`.
```
-------------

¿Qué tema quieres tratar?  introducción a la programación
¿Es un ejercicio? (s/n)  n
¿Cómo quieres llamar al archivo?  introduccion
¿Quieres añadirlo al final del archivo si este ya existe? (s/n)  s
```
---

### Corregir ejercicios

La opción 2 permite al usuario corregir ejercicios. El programa leerá todos los archivos de código fuente que se encuentren en la carpeta `input` y generará un archivo por cada ejercicio que se encuentre en la carpeta `output` con el mismo nombre y formato que el archivo de entrada. **Aviso: la correción de ejercicios no es muy precisa, pero puede servir como guía para corregir los ejercicios. Es conveniente que los ejercicios a corregir incluyan el enunciado en el comentario de la primera línea del archivo, ya que PyTA utilizará este enunciado como base para generar la respuesta**. Se puede cambiar la frase usada para corregir los ejercicios en el archivo `PyTA.py` modificando la constante `CORRECTION`.

---

### Escribir libremente

La opción 3 permite al usuario escribir libremente en el contexto actual. El usuario puede escribir lo que desee y PyTA generará una respuesta a la consulta ingresada. El resultado de la consulta se guardará en el archivo con el nombre especificado por el usuario en la carpeta `output`.
```
-------------

Escribe lo que quieras:  cuanto es 9 * 9?      
¿Cómo quieres llamar al archivo?  multiplicacion
¿Quieres añadirlo al final del archivo si este ya existe? (s/n)  s
El resultado de 9 x 9 es: 


console.log(9 * 9); // 81

{'text': 'cuanto es 9 * 9?', 'filename': 'multiplicacion', 'append': True}
```

---

### Cambiar contexto

La opción 4 permite al usuario cambiar el contexto actual. El contexto se utiliza para poner en situación a PyTA y generar respuestas más precisas. El usuario puede ingresar el contexto que desee y PyTA generará una respuesta a la consulta ingresada. Para cambiar el contexto por defecto al iniciar la aplicación, se debe modificar el archivo `PyTA.py` modificando la constante `CONTEXT` por el contexto deseado.
```
-------------

El contexto actual es el siguiente:
---------
Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en el formato correspondiente.
---------
Escribe el nuevo contexto (presiona enter para mantener el anterior): 
¿Qué contexto quieres añadir?  Tu coche se ha estropeado y no tienes batería en el móvil para llamar a emergencias
{'context': 'Tu coche se ha estropeado y no tienes batería en el móvil para llamar a emergencias'}
```

---

### Salir

La opción 5 permite al usuario salir de la aplicación. Al salir, PyTA mostrará por pantalla las opciones que se utilizaron en la última ejecución.

---

## Sugerencias de mejoras y colaboración
---

Si tienes alguna sugerencia de mejoras o quieres colaborar con el proyecto, puedes abrir un issue en el repositorio de GitHub. Este proyecto no está hecho con ambiciones comerciales, el objetivo es que sea una herramienta útil para la comunidad educativa.
