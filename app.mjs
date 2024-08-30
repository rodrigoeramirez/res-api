// REST es una arquitectura de software y REST API es untipo de comunicación en RED.
// En REST todo es un RECURSO (en este ejemplo "movies") y se identifica a través de una URL. (El recurso puede ser REPRESENTADO en json, xml y html, pero se suele utilizar JSON)
// Para manejar esos recursos se utilizan los METHOD (GET, POST, etc).
// La REST API debe ser Stateless, esto quiere decir que el servidor no debe calcular nada para responder, toda la informacion ncesaria debe ser enviada por URL.

// Primero debo inicializar el proyecto: Me pocisiono en clase3 y escribo npm init -y para inicializar el proyecto y crear el package.json

import express from "express"; //  Mediante ESM importo el modulo de "express", que habia instalado con NPM.
import movies from "./movies.json" assert { type: "json" }; // Importo el archivo movies.json y pongo asser porque en ESM todavia no estpa desarrollado del todo json.
import { validateMovie, validateMoviePartial } from "./validate.mjs";
const app = express(); // Aqui estaria creando el servidor.
app.disable("x-powered-by"); // Deshabilito el powered-by del header por seguridad.
app.use(express.json()); // Es un middleware, una funcion que se ejecuta despues de la peticion (req) y antes de la respuesta (res)

app.get("/", (req, res) => {
  res.send("<h1>Inicio</h1>");
});

// "/movies" es un end point que recupera todas las peliculas.
app.get("/movies", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // Con * le doy permiso a todas las paginas web.
  const { genre } = req.query; // Con la query puedo obtener el valor de todo por ejemplo "/movies?genre=terror&id=dcdd0fad-a94c-4810" -> {genre, id}
  if (genre) {
    const movie = movies.filter((movie) => movie.genre.includes(genre)); // Uso include porque en el json el genero es un array de strings
    res.json(movie);
  } else {
    res.json(movies);
  }
});
// :id es un parametro de la url
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("<h1>Movie Not Found<h1>");
  }
});

app.post("/movies", (req, res) => {
  //const { id, title, year, director, duration, poster, genre, rate } = req.body; // Esto lo puedo obtner gracias al middleware express.json
  const result = validateMovie(req.body); // Utilizo la funcion que valida con zod y que esta en movie.mjs. Esto solo me entrega los datos
  if (result.error) {
    res.status(400).send(result.error.message);
  } else {
    const newmovie = { ...result.data };
    movies.push(newmovie); // Agrego la movie validada a movies
    res.status(201).json(newmovie); // Lo muestro como respuesta.
  }
});

app.patch("/movies/:id", (req, res) => {
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
});

app.use((req, res) => {
  res.status(404).send("<h1>Error 404</h1>");
});

const PORT = process.env.PORT ?? 3000; // La variable de entorno "PORT" siempre va en mayuscula.

app.listen(PORT, (err, res) => {
  console.log("Escuchando en el puerto:" + PORT);
});
