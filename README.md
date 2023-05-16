# PyTA - Python Teaching Assistant

![pyta](static/img/pyta-sm.png)
       
PyTA es un asistente de enseñanza hecho con Python y React que utiliza la API de OpenAI para proporcionar respuestas relevantes y personalizadas a las consultas de profesores y estudiantes. Permite descargar las respuestas en formato Markdown y exportarlas a un archivo PDF.


## Índice

- [Puesta en marcha](#puesta-en-marcha)
  - [.env](#env)
  - [Docker](#docker)
- [Uso](#uso)

---

## Puesta en marcha

### .env

El archivo `.env` contiene las credenciales de OpenAI  y la IP del backend.
Es necesario contar con credenciales de OpenAI para usar PyTA. Para ello, se debe crear una cuenta en la plataforma y generar una clave de API y una organización. Estas credenciales se deben guardar en el archivo `.env` en la raíz del proyecto. El archivo `.env` debe tener el siguiente formato:

```
OPENAI_API_KEY=<clave_de_api>
OPENAI_ORGANIZATION=<ID_de_la_organizacion>
REACT_APP_BACKEND_IP=<ip o url del backend>

```
Filas:
  - `<clave_de_api>`: Clave de API de OpenAI.
  - `<ID_de_la_organizacion>`: ID de la organización de OpenAI.
  - `<ip o url del backend>`: IP o URL del backend. Por defecto es `localhost`,pero si se desea acceder desde otra máquina, se debe cambiar a la IP de la máquina donde se ejecuta el backend. Por ejemplo, si el backend se ejecuta en la máquina con IP `192.168.1.5`, la fila quedaría así: `REACT_APP_BACKEND_IP=192.168.1.5`.



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

----
## Uso

Accedemos en el navegador a la dirección `localhost:3000`.
* La pantalla principal nos mostrará la lista de conversaciones y podremos crear una nueva conversación o continuar una ya existente.
* En la conversación, podemos escribir libremente y PyTA responderá con una respuesta personalizada. También podemos modificar los mensajes o cambiar el rol de estos (usuario, asistente o sistema), cambiar el orden en el que aparecen, etc. 
* La sección plantillas nos permite crear plantillas para los mensajes que se enviarán al asistente. Estas plantillas se pueden usar para crear mensajes de forma más rápida y sencilla.

---

## Sugerencias de mejoras y colaboración


Si tienes alguna sugerencia de mejoras o quieres colaborar con el proyecto, puedes abrir un issue en el repositorio de GitHub. Este proyecto no está hecho con ambiciones comerciales, el objetivo es que sea una herramienta útil para la comunidad educativa.
