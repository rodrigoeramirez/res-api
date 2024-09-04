// Estos enrtutadores se hacen para separar codigo y que todas las peticiones que tengan incluidas "/movies" esten todas en un mismo lugar.
import { Router } from "express"; // Es una funcion que actua como enrutador.
import movies from "../movies.json" with { type: "json" }; // Importo el archivo movies.json y pongo asser porque en ESM todavia no estpa desarrollado del todo json.
import { validateMovie, validateMoviePartial } from "../validate.mjs";
export const moviesRouter = Router();

// "/movies" es un end point que recupera todas las peliculas.
moviesRouter.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // Con * le doy permiso a todas las paginas web.
  const { genre } = req.query; // Con la query puedo obtener el valor de todo por ejemplo "/movies?genre=terror&id=dcdd0fad-a94c-4810" -> {genre, id}
  if (genre) {
    const movie = movies.filter((movie) => movie.genre.includes(genre)); // Uso include porque en el json el genero es un array de strings
    res.json(movie);
  } else {
    res.json(movies);
  }
})
// :id es un parametro de la url
moviesRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id == id);
  
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("<h1>Movie Not Found<h1>");
    }
})
moviesRouter.post("/", (req, res) => {
     //const { id, title, year, director, duration, poster, genre, rate } = req.body; // Esto lo puedo obtner gracias al middleware express.json
  const result = validateMovie(req.body); // Utilizo la funcion que valida con zod y que esta en movie.mjs. Esto solo me entrega los datos
  if (result.error) {
    res.status(400).send(result.error.message);
  } else {
    const newmovie = { ...result.data };
    movies.push(newmovie); // Agrego la movie validada a movies
    res.status(201).json(newmovie); // Lo muestro como respuesta.
  }
})
moviesRouter.patch("/:id", (req, res) => {
    const result = validateMoviePartial(req.body); // Es parcial porque no le estoy pasando todo el cuerpo de la pelicula, solo el año que deseo modificar.
    if (!result.success) {
      return res.status(400).send(result.error.message);
    } else {
      const { id } = req.params; // Recupero la id de la url.
      const movie = movies.find((m) => m.id === id); // Busco dentro del json la movie
      if (!movie) {
        res.status(404).send("<h1>Movie not found.<h1>"); // Si no la encuentra
      } else {
        const update = {
          ...movie,
          ...result.data, // Así se actualiza en una nueva variable con los "..."
        };
        res.status(201).send(update); // Si la encuentra la muestra
      }
    }
})
