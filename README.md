# PyTA

## Programa de ayuda para correción de ejercicios de programación

### Instalación y puesta en marcha:

* Las librerías necesarias se encuentran en ```requirements.txt```. Para instalarlas podemos ejecutar ```pip install -r requirements.txt```
* Hay que crear un archivo .env con la siguiente línea: ```OPENAI_API_KEY=<tu-clave>``` donde ```<tu-clave>``` es la clave de la API que openAI te proporcionará.

API de openAI: https://openai.com/api/ (registro gratuito)  
Sección de claves API: https://platform.openai.com/account/api-keys


### Uso:

* poner el archivo que queramos corregir en el directorio input
* ejecutar el archivo ``` main.py <nombre-fichero> ```, si no se introduce ninguno por defecto buscará el archivo ```prueba.js``` dentro de input
* el resultado se guardará en el directorio output, con el nombre y extensión del archivo corregido
