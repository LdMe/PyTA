
// Error 1:  La url de la llamada está mal, debe ser 'http://www.omdbapi.com/?apikey=20dac387&t=${title}' en lugar de 'http://www.omdbapi.com/?apikey=20dac387&s=${title}'. La última parte, 's' debe ser sustituida por 't' que corresponde con 'título'.

//Error 2: La función devuelve el resultado de la búsqueda, pero este resultado no es el objeto de la respuesta de la llamada a la API. Se debe devolver la propiedad 'data' directamente: return response.data;