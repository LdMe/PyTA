// quiero conseguir hacer una llamada a la api de omdb y que me devuelva el resultado de la busqueda

const axios = require('axios');

const getMovies = async (title) => {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=20dac387&s=${title}`);
    return response.data.Search;
    }
