const sql = require("mssql");
const { connection } = require("../Database/connection");

/* Importar servicios */
const jwtService = require("../services/jwt");

/* Importar modelo de login */
const loginModel = require("../Models/inventarioModel");

const pruebaLogin = (req, res) => {
    res.status(200).send({
        message: 'Prueba login'
    })
}

const inicioSesion = async (req, res) => {
    /* Recibir body */
    let body = req.body;

    /* Validar que los campos esten llenos */
    if (!body.usuario || !body.contrasenia) {
        return res.status(400).send({
            status: "vacio",
            message: "Email o contraseña faltantes"
        });
    }

    try {
        /* Buscar usuario */
        const pool = await connection();
        const result = await pool.request()
            .input("usuario", sql.VarChar, body.usuario)
            .input("contrasenia", sql.VarChar, body.contrasenia)
            .query("SELECT * FROM usuario WHERE usuario = @usuario AND contrasenia = @contrasenia");

        /* Comprobar si existe */
        if (result.recordset.length <= 0) {
            return res.status(400).send({
                statis: "noExiste",
                message: "El usuario no existe"
            });
        }

        const usuario = result.recordset[0];
        /* Obtener token */
        const token = jwtService.createToken(usuario);

        /* Enviar respuesta */
        return res.status(200).send({
            status: "success",
            token: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al iniciar sesión"
        });
    }

}

module.exports = {
    pruebaLogin,
    inicioSesion
}