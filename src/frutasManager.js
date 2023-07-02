const fs = require("fs");
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Función para guardar frutas en el archivo de base de datos
function guardarFrutas(frutas) {
  const datos = JSON.stringify(frutas); // Convertir el arreglo de frutas a formato JSON
  fs.writeFileSync(__dirname + process.env.DATABASE_PATH, datos); // Escribir los datos en el archivo definido en la variable de entorno DATABASE_PATH
}

// Función para leer frutas desde el archivo de base de datos
function leerFrutas() {
  const frutasString = fs.readFileSync(__dirname + process.env.DATABASE_PATH, "utf8"); // Leer los datos del archivo definido en la variable de entorno DATABASE_PATH como una cadena de texto
  const frutas = JSON.parse(frutasString); // Convertir la cadena de texto JSON a un arreglo de frutas
  return frutas; // Devolver el arreglo de frutas
}

// Función para obtener frutas por el id
async function findOneById(id) {
  if (!id) throw new Error("Error. Id indefinido.");
  const database = await leerFrutas();
  const idFruta  = database.find((database) => database.id === id);
  if (!idFruta) throw new Error("Error. El Id no corresponde a una fruta existente en la base de datos.");
  return idFruta;}

// Función para actualizar frutas por el id
async function updateFruta(fruta) {
  if (!fruta.id || !fruta.imagen || !fruta.nombre || !fruta.importe || !fruta.stock) throw new Error("Error. Datos incompletos.");
  let database  = await leerFrutas();
  const idFrutaDatabase = database.findIndex((database) => database.id === fruta.id);
  if (idFrutaDatabase < 0) throw new Error("Error. El Id no corresponde a una fruta existente en la base de datos");
  database[idFrutaDatabase] = fruta;
  await guardarFrutas(database);
  return database[idFrutaDatabase];
}

// Funcion para eliminar fruta por el id
async function destroy(id) {
  if (!id) throw new Error("Error. El Id no corresponde a una fruta existente en la base de datos");
  let database   = await leerFrutas();
  const idFruta = database.findIndex((database) => database.id === id);
  if (idFruta < 0) throw new Error("Error. El Id no corresponde a una fruta existente en la base de datos");
  const  eliminarFruta= database[idFruta];
  database.splice(idFruta, 1);
  await guardarFrutas(database);
  return eliminarFruta;
}

// Exportar las funciones para ser utilizadas por otros módulos
module.exports = {
  leerFrutas,
  guardarFrutas,
  findOneById,
  destroy,
  updateFruta,
};
