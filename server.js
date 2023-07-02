// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas, findOneById, destroy, updateFruta } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para encontrar una fruta por el id
app.get('/id/:id', (req, res) => {
  const { id } = req.params;
  findOneById(Number(id)) 
      .then((BD) => res.status(200).send(BD))
      .catch((error) => res.status(400).send(error.message));
});

// Ruta para actualizar una fruta por el id
app.put('/id/:id', (req, res) => {
  const { id } = req.params;
  const { imagen, nombre, importe, stock} = req.body;
  updateFruta({ id: Number(id), imagen, nombre, importe, stock })
      .then((BD) => res.status(200).send(BD))
      .catch((error) => res.status(400).send(error.message));
});

// Ruta para eliminar una fruta por el id
app.delete('/id/:id', (req, res) => {
  const { id } = req.params;
  destroy(Number(id))
      .then((BD) => res.status(200).send(BD))
      .catch((error) => res.status(400).send(error.message));
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
