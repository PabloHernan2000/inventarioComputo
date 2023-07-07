/* Importar dependencias */
const sql = require("mssql");
const { connection } = require("../Database/connection");

/* Importar modelo de inventario */
const InventarioModel = require("../Models/inventarioModel");

const prueba = (req, res) => {
    return res.status(200).send({
        message: "prueba"
    });
};

const mostrarInventario = async (req, res) => {
    try {
        const pool = await connection();
        const result = await pool.request().query("SELECT * FROM inventario");

        /* Enviar respuesta */
        return res.status(200).send({
            status: "success",
            data: result.recordset
        });
    } catch (error) {
        /* Enviar respuesta */
        return res.status(500).send({
            status: "error",
            data: 'Error al obtener los datos'
        });
    }
}

const mostrarUsuario = (req, res) => {
    return res.status(200).send({
        nombreUsuario: req.user.nombre
    });
}


const registroInventario = async (req, res) => {
    /* Obtener el los datos */
    let body = req.body;

    /* Validar que todos los campos no esten vacios */
    if (!body.noInventario || !body.descripcion || !body.marca || !body.modelo || !body.serie || !body.departamento || !body.responsable || !body.fechaAdquisicion || !body.valorAdquisicion || !body.estado) {
        return res.status(400).send({
            status: "vacio",
            message: "Faltan campos por llenar"
        });
    }

    const fechaIngresada = new Date(body.fechaAdquisicion);
    const fechaActual = new Date();

    /* Validar que la fecha ingresada no sea posterior a la actual */
    if (fechaIngresada > fechaActual) {
        return res.status(400).send({
            status: "fechaPosterior",
            message: "La fecha no puede ser posterior a la actual"
        });
    }

    let inventario = new InventarioModel(parseInt(body.noInventario), body.descripcion, body.marca, body.modelo, body.serie, body.departamento, body.responsable, body.fechaAdquisicion, parseFloat(body.valorAdquisicion), body.estado);

    try {
        /* OBTENER CONEXION */
        const pool = await connection();

        /* Comprobar si el noInventario ya existe */
        const row = await pool.request()
            .input('noInventario', sql.Int, inventario.noInventario)
            .query("SELECT noInventario FROM inventario WHERE noInventario = @noInventario")

        if (row.recordset.length > 0) {
            /* Enviar respuesta */
            return res.status(400).send({
                status: "duplicado",
                message: "El numero de inventario ya existe"
            });
        }

        /* Validar que el valor de adquisicion no sea negativo */
        if (inventario.valorAdquisicion < 0) {
            return res.status(200).send({
                status: 'negativo',
                message: 'El valor de adquisición no puede ser menor a cero'
            });
        }

        await pool.request()
            .input('noInventario', sql.Int, inventario.noInventario)
            .input('descripcion', sql.VarChar, inventario.descripcion)
            .input('marca', sql.VarChar, inventario.marca)
            .input('modelo', sql.VarChar, inventario.modelo)
            .input('serie', sql.VarChar, inventario.serie)
            .input('departamento', sql.VarChar, inventario.departamento)
            .input('responsable', sql.VarChar, inventario.responsable)
            .input('fechaAdquisicion', sql.VarChar, inventario.fechaAdquisicion)
            .input('valorAdquisicion', sql.Float, inventario.valorAdquisicion)
            .input('estado', sql.VarChar, inventario.estado)
            .query("INSERT INTO inventario (noInventario, descripcion, marca, modelo, serie, departamento, responsable, fechaAdquisicion, valorAdquisicion, estado) VALUES(@noInventario, @descripcion, @marca, @modelo, @serie, @departamento, @responsable, @fechaAdquisicion, @valorAdquisicion, @estado)")

        /* Enviar respuesta */
        return res.status(200).send({
            status: "success",
            message: "Inventario registrado correctamente!"
        });
    } catch (error) {
        /* Enviar respuesta */
        return res.status(500).send({
            status: "error",
            message: "Error al resgistrar inventario",
            error: error
        });
    }
}

const seleccionarInventario = async (req, res) => {
    /* Obtener parametro */
    const param = parseInt(req.params.inventario);

    /* Validar que el parametro exista y que ademas sea un numero entero */
    if (!param || !Number.isInteger(param)) {
        /* Enviar respuesta */
        return res.status(400).send({
            status: 'noValido',
            message: 'El parametro no es válido'
        });
    }

    try {
        const pool = await connection();
        const result = await pool.request()
            .input("noInventario", sql.Int, param)
            .query("SELECT * FROM inventario WHERE noInventario = @noInventario");

        /* Si no existe */
        if (result.recordset.length <= 0) {
            /* Enviar respuesta */
            return res.status(400).send({
                status: 'noExiste',
                message: 'No se encontraron resultados'
            });
        }
        /* Enviar respuesta */
        return res.status(200).send({
            status: 'success',
            data: result.recordset
        });

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'El registro no existe'
        });
    }
}

const modificarInventario = async (req, res) => {
    /* Obtener datos del body */
    const body = req.body;
    let inventario = new InventarioModel(parseInt(body.noInventario), body.descripcion, body.marca, body.modelo, body.serie, body.departamento, body.responsable, body.fechaAdquisicion, parseFloat(body.valorAdquisicion), body.estado);

    try {
        const pool = await connection();
        await pool.request()
            .input('noInventario', sql.Int, inventario.noInventario)
            .input('descripcion', sql.VarChar, inventario.descripcion)
            .input('marca', sql.VarChar, inventario.marca)
            .input('modelo', sql.VarChar, inventario.modelo)
            .input('serie', sql.VarChar, inventario.serie)
            .input('departamento', sql.VarChar, inventario.departamento)
            .input('responsable', sql.VarChar, inventario.responsable)
            .input('fechaAdquisicion', sql.VarChar, inventario.fechaAdquisicion)
            .input('valorAdquisicion', sql.Float, inventario.valorAdquisicion)
            .input('estado', sql.VarChar, inventario.estado)
            .query("UPDATE inventario SET descripcion = @descripcion, marca = @marca, modelo = @modelo, serie = @serie, departamento = @departamento, responsable = @responsable, fechaAdquisicion = @fechaAdquisicion, valorAdquisicion = @valorAdquisicion, estado = @estado WHERE noInventario = @noInventario");

        /* Enviar respuesta */
        return res.status(200).send({
            status: 'success',
            message: 'Datos actualizados correctamente'
        });

    } catch (error) {
        return res.status(400).send({
            status: 'error',
            message: 'Error al modificar los datos'
        });
    }

}

module.exports = {
    prueba,
    mostrarInventario,
    mostrarUsuario,
    registroInventario,
    seleccionarInventario,
    modificarInventario,
    modificarInventario
}