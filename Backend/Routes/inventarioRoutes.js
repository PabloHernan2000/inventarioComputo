const express = require("express");
const router = express.Router();
/* Importar controlador de inventario */
const inventarioController = require("../Controller/inventarioController");

const check = require("../middlewares/auth");

router.get("/prueba", inventarioController.prueba);
router.get("/inventario", check.auth ,inventarioController.mostrarInventario);
router.get("/usuario", check.auth ,inventarioController.mostrarUsuario);
router.post("/registro", check.auth ,inventarioController.registroInventario);
router.get("/inventario/:inventario", check.auth ,inventarioController.seleccionarInventario);
router.put("/modificar", check.auth ,inventarioController.modificarInventario);

module.exports = router