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

### .env

El archivo `.env` contiene las credenciales de OpenAI .
Es necesario contar con credenciales de OpenAI para usar PyTA. Para ello, se debe crear una cuenta en la plataforma y generar una clave de API y una organización. Estas credenciales se deben guardar en el archivo `.env` en la raíz del proyecto. El archivo `.env` debe tener el siguiente formato:

```
OPENAI_API_KEY=<clave_de_api>
OPENAI_ORGANIZATION=<ID_de_la_organizacion>

```
Filas:
  - `<clave_de_api>`: Clave de API de OpenAI.
  - `<ID_de_la_organizacion>`: ID de la organización de OpenAI.


Podemos usar el archivo [.env.example](.env.example) como plantilla.


- [ID de la organización](https://platform.openai.com/account/org-settings)
- [Clave de API](https://platform.openai.com/account/api-keys)

---
### Docker

Podemos poner en marcha el servidor con docker compose.

` docker-compose up -d`

Los contenedores de PyTA y mongodb se reiniciarán automáticamente, por lo que si se desea detener el servidor, se debe ejecutar el siguiente comando:

` docker-compose down`


---

### Instalación con Python
Para poder poner en marcha el programa PyTA, se deben seguir los siguientes pasos:

1. Tener instalado Python 3.10 o superior.

2. Tener un servidor de mongodb en localhost:27017 o cambiar el archivo mongo_connection.py para que se conecte a otro servidor.

3. Instalar las librerías necesarias. Para esto, se puede usar el gestor de paquetes `pip` y ejecutar el siguiente comando: 

```bash
pip install -r requirements.txt
```

 Este archivo `requirements.txt` especifica las librerías y sus versiones necesarias para poder utilizar PyTA.

Una vez realizados estos pasos, PyTA está listo para ser utilizado. Se puede crear el servidor de PyTA con el siguiente comando:

```
python3 app.py

```
----
## Uso

Accedemos en el navegador a la dirección `localhost:5500`.
* La pantalla principal nos mostrará la lista de conversaciones y podremos crear una nueva conversación o continuar una ya existente.
* En la conversación, podemos escribir libremente y PyTA responderá con una respuesta personalizada. También podemos modificar los mensajes o cambiar el rol de estos (usuario, asistente o sistema), cambiar el orden en el que aparecen, etc. 
* La sección plantillas, a la que podemos acceder desde la barra de navegación, nos permite crear plantillas para los mensajes que se enviarán al asistente. Estas plantillas se pueden usar para crear mensajes de forma más rápida y sencilla.

---

## Sugerencias de mejoras y colaboración


Si tienes alguna sugerencia de mejoras o quieres colaborar con el proyecto, puedes abrir un issue en el repositorio de GitHub. Este proyecto no está hecho con ambiciones comerciales, el objetivo es que sea una herramienta útil para la comunidad educativa.
