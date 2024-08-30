import zod from "zod"; // Zod es un modulo que sirve para validaciones.

// Consiste en crear un esquema, donde despues le voy pasando de a una movie y me devuelve la validacion completa.

// "movieobject" no es una función, sino un esquema de validación creado con Zod.
const esquema = zod.object({
  id: zod.string({ invalid_type_error: "El campo id debe ser un String." }),
  title: zod.string({ required_error: "Debe completar este campo." }),
  year: zod.number().int().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().positive(),
  poster: zod.string().url(),
  genre: zod.array(zod.string()),
  rate: zod.number().min(0).max(10),
});

// Retorno los datos validados exitosos  o con sus correspondientes errores. Son solo datos sin ningun formato.
// En object iria el req.body.
export function validateMovie(object) {
  // Utilizo el esquema de validacion que cree, para validar el "req.body"
  return esquema.safeParse(object); // Para evitar el uso de un try catch, utilizo el safeParse que te devuelve si hay datos o si hay un error para tratarlo en un if.
}

export function validateMoviePartial(object) {
  // Utiliza una validacion parcial, si el objetoi que le paso tiene la propiedad la valida, sono la pasa por alto
  return esquema.partial().safeParse(object);
}
