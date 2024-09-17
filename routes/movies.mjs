// Estos enrtutadores se hacen para separar codigo y que todas las peticiones que tengan incluidas "/movies" esten todas en un mismo lugar.
import { Router } from "express"; // Es una funcion que actua como enrutador.
// import movies from "../movies.json" with { type: "json" }; // Importo el archivo movies.json y pongo asser porque en ESM todavia no estpa desarrollado del todo json.
import { validateMovie, validateMoviePartial } from "../validate.mjs";
export const moviesRouter = Router();
import { MovieModel } from "../models/movie.mjs";
import { MovieController } from "../controllers/movies.mjs";

// "/movies" es un end point que recupera todas las peliculas.
// Lo hago asyncrono porque desde la solicitud nunca se sabe como va a trabajar el model si sincrono o asincrono.
// IMPORTANTE: Si uso funciones asincronas debo usar try catch para que no se rompa la app. Puedo usar middlewares para evitar repetir codigo de try catch en todas las peticiones.
moviesRouter.get("/", MovieController.getAll);

// :id es un parametro de la url
moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.createMovie);

moviesRouter.patch("/:id", MovieController.modifyMovie);
