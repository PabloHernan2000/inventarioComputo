const express = require("express");
const loginController = require("../Controller/loginController");

const router = express.Router();

router.get("/pruebaLogin", loginController.pruebaLogin);
router.post("/login", loginController.inicioSesion);

module.exports = router;