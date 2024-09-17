import movies from "../movies.json" with { type: "json" }; // archivo con los datos, equivale a bse de datos jeje

// Creo una clase para exportar. Tambien podria solo crear el metodo "getAll()" y luego exportarlo, pero hago una clase para
export class MovieModel {
// Esta clase tiene diferrentes metodos estaticos.
// Pero es sincrono y lo tengo que ser asincrono para
static async getAll({genre}){
    if (genre) {
        const movie = movies.filter((movie) => movie.genre.includes(genre)); // Uso include porque en el json el genero es un array de strings
        return movie;
      } else {
        return movies;
      }
}

// Esto hace una consulta por id
static async getById({ id }) {
    const movie = movies.find((movie) => movie.id === id);
   return movie;
}


static async createMovie ({input}){
  const newmovie = { ...input };
  movies.push(newmovie) // Agrega la movie validada a movies. Estaira guardado en la base de datos
  return newmovie;
}

static async modifyMovie ({id, input}) {
  const movie = movies.find((movie) => movie.id === id); // Busco dentro del json la movie
  if (!movie) {
    return false; // Si no la encuentra
  } else {
    const update = {
      ...movie,
      ...input, // Así se actualiza en una nueva variable con los "..."
    };
    return update;
  }
}
}