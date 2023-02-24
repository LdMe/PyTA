# PyTA

## Programa de ayuda para correción de ejercicios de programación

Con este simple script podemos corregir nuestros ejercicios y ver cómo deberíamos solucionar los errores. No es 100% efectivo, y el resultado puede variar en cada iteración. Usadlo bajo vuestra propia responsabilidad y poniendo mucha atención a los resultados, es posible que la explicación sea correcta pero haya algún error en el código, o puede pasar lo contrario. Esta es una prueba conceptual para demostrar la utilidad de la IA y el potencial que tiene de cambiar nuestra forma de trabajar.

### Instalación y puesta en marcha:

* Las librerías necesarias se encuentran en ```requirements.txt```. Para instalarlas podemos ejecutar ```pip install -r requirements.txt```
* Hay que crear un archivo .env con la siguiente línea: ```OPENAI_API_KEY=<tu-clave>``` donde ```<tu-clave>``` es la clave de la API que openAI te proporcionará.

API de openAI: https://openai.com/api/ (registro gratuito)  
Sección de claves API: https://platform.openai.com/account/api-keys


### Uso:
* crear directorios "input" y "output" si no existen
* poner el archivo que queramos corregir en el directorio input
* ejecutar el archivo ``` main.py <nombre-fichero> ```, si no se introduce ninguno por defecto buscará el archivo ```prueba.js``` dentro de input
* el resultado se guardará en el directorio output, con el nombre y extensión del archivo corregido

### Ejemplo:

#### ejercicio.js dentro del directorio input
```
// función que devuelva si un número es primo

function esPrimo(numero) {
  for (i = 2; i < numero; i++) {
    if (numero[i] % i === 0) {
      return False;
    }
  }
  return numero > 1;
}
```
### ejecución 
```python main.py ejercicio.js```
### resultado: ejercicio.js en output

```
// Error 1: La variable "i" está sin inicializar.
// Solución: inicializar la variable "i" con un valor de 2. 
// let i = 2;

// Error 2: La variable "numero" debería compararse con el contador "i" para obtener el resto de una división, sin embargo se está comparando con un objeto que no existe.
// Solución: reemplazar "numero[i]" por "numero". 
// if (numero % i === 0) {

// Error 3: La función está devolviendo una palabra ("False") en vez de una variable booleana ("false"). 
// Solución: reemplazar "False" por "false".
// return false;

// Error 4: La función no está devolviendo el resultado correcto, ya que siempre devolverá "true" si el número es mayor a 1, sin tener en cuenta si es primo o no. 
// Solución: modificar el código para que devuelva "true" solo si el número es primo. 
function esPrimo(numero) {
  for (i = 2; i < numero; i++) {
    if (numero % i === 0) {
      return false;
    }
  }
  if (numero > 1) {
    return true;
  } else {
    return false;
  }
}
```
