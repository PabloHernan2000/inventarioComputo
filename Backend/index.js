'use strict'
const express = require("express");
const cors = require("cors");

console.log("api-rest inciciada");

const app = express();
const port = 8080;

app.use(cors());

/* Convertir request a json */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Importar rutas */
const inventarioRoute = require("./Routes/inventarioRoutes");
app.use("/api", inventarioRoute);

const loginRoutes = require("./Routes/loginRoutes");
app.use("/api", loginRoutes)

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});