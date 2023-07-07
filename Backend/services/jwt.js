/* Importar dependencias */
const jwt = require("jwt-simple");
const moment = require("moment");

/* Clave para generar token */
const secret = "cL@v3_secr3t@_del_sistem@_inv3ntario_$@%";

/* Función para generar tokens */
const createToken = (user) => {
    /* Lo que se carga en el token */
    const payload = {
        usuario: user.usuario,
        nombre: user.nombre,
        iat: moment().unix(), /* Momento en el que se crea el payload */
        exp: moment().add(10, "days").unix() /* Fecha expiración */
    }

    /* Devolver token codificado */
    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret
}