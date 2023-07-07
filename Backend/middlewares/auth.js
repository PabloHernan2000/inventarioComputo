/* Importar dependencias */
const jwt = require("jwt-simple");
const moment = require("moment");

/* Importar clave secreta */
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

/* Middleware de autenticación */
exports.auth = (req, res, next) => { /* next es para hacer un salto al siguiente metodo o acción */
    /* Si no hay cabecera de autorización */
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: 'error',
            message: 'No haz iniciado sesión'
        });
    }
    /* Decodificar token */

    /* Limpiar el token */
    let token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        /* Decodificar token */
        let payload = jwt.decode(token, secret);

        /* Comprobar la expiración del token */
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "expirado",
                message: "Sesión expirada"
            });
        }

        /* Añadir datos de usuario a request */
        req.user = payload;
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error: error
        });
    }

    /* Saltar a la ejecución del controlador */
    next();
} 