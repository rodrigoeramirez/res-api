import { MovieModel } from "../models/movie.mjs";
import { validateMovie } from "../validate.mjs";

export class MovieController {
  static async getAll(req, res) {
    // Async se usa para indicar que la función contiene operaciones asíncronas, permitiendo el uso de await dentro de ella.
    res.header("Access-Control-Allow-Origin", "*"); // Con * le doy permiso a todas las paginas web.
    const { genre } = req.query; // Con la query puedo obtener el valor de todo por ejemplo "/movies?genre=terror&id=dcdd0fad-a94c-4810" -> {genre, id}
    // La operacion getAll() es asincrona porque consulta a la base de datos y toma tiempo.
    const movies = await MovieModel.getAll({ genre }); // Pausa la ejecución de la función hasta que la promesa se resuelve (SE OBTIENEN LAS PELICULAS), se está haciendo una consulta a la base de datos.
    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("<h1>Movie Not Found<h1>");
    }
  }

  static async createMovie(req, res) {
    //const { id, title, year, director, duration, poster, genre, rate } = req.body; // Esto lo puedo obtner gracias al middleware express.json
    const result = validateMovie(req.body); // Utilizo la funcion que valida con zod y que esta en movie.mjs. Esto solo me entrega los datos
    if (result.error) {
      res.status(400).send(result.error.message);
    } else {
      const newmovie = await MovieModel.createMovie({ input: result.data }); // Agrego la movie validada a movies
      res.status(201).json(newmovie); // Lo muestro como respuesta.
    }
  }

  static async modifyMovie(req, res) {
    const result = validateMoviePartial(req.body); // Es parcial porque no le estoy pasando todo el cuerpo de la pelicula, solo el año que deseo modificar.
    if (!result.success) {
      return res.status(400).send(result.error.message);
    } else {
      const { id } = req.params; // Recupero la id de la url.
      const update = await MovieModel.modifyMovie({ id, input: result.data });
      res.status(201).send(update); // Si la encuentra la muestra
    }
  }
}
