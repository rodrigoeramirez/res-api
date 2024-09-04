// REST es una arquitectura de software y REST API es untipo de comunicación en RED.
// En REST todo es un RECURSO (en este ejemplo "movies") y se identifica a través de una URL. (El recurso puede ser REPRESENTADO en json, xml y html, pero se suele utilizar JSON)
// Para manejar esos recursos se utilizan los METHOD (GET, POST, etc).
// La REST API debe ser Stateless, esto quiere decir que el servidor no debe calcular nada para responder, toda la informacion ncesaria debe ser enviada por URL.

// Primero debo inicializar el proyecto: Me pocisiono en clase3 y escribo npm init -y para inicializar el proyecto y crear el package.json

import express from "express"; //  Mediante ESM importo el modulo de "express", que habia instalado con NPM.
const app = express(); // Aqui estaria creando el servidor.
app.disable("x-powered-by"); // Deshabilito el powered-by del header por seguridad.
app.use(express.json()); // Es un middleware, una funcion que se ejecuta despues de la peticion (req) y antes de la respuesta (res)
import { moviesRouter } from "./routes/movies.mjs";

app.get("/", (req, res) => {
  res.send("<h1>Inicio</h1>");
});

app.use("/movies", moviesRouter); // Cuando accedo a "/movies" (prefijo), le doy acceso a todas las rutas que separe por prolijidad. Es decir que cuando en la url detecte un /movies, automaticamente va a ir al moviesRouter.
// Esto de arriba es igual a todo esto de abajo.
// "/movies" es un end point que recupera todas las peliculas.
//app.get("/movies", todo);
// :id es un parametro de la url
//app.get("/movies/:id", todo);
//app.post("/movies", todo);
//app.patch("/movies/:id", todo);

app.use((req, res) => {
  res.status(404).send("<h1>Error 404</h1>");
});

const PORT = process.env.PORT ?? 3000; // La variable de entorno "PORT" siempre va en mayuscula.

app.listen(PORT, (err, res) => {
  console.log("Escuchando en el puerto:" + PORT);
});
