/*-------------------------------------------------------- 
    VERIFICAR SI EL USUARIO TIENE UNA SESIÓIN ABIERTA
---------------------------------------------------------*/
/* Obtener token */
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", async () => {

    /*------------------------------ 
        MOSTRAR NOMBRE DE USUARIO
    ------------------------------*/
    const nombreApi = await fetch("http://localhost:8080/api/usuario", {
        headers: {
            "Authorization": `${token}`
        }
    });
    const response = await nombreApi.json();
    let nombre_usuario = document.getElementById("nombre_usuario");
    nombre_usuario.innerHTML = response.nombreUsuario;

    /*------------------- 
        CERRAR SESIÓN
    --------------------*/
    document.getElementById("cerrar_sesion").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
    });

    /*------------------------------ 
        CARGAR DATOS EN LA TABLA 
    -------------------------------*/
    /* Obtener el cuerpo de la tabla */
    let datos_inventario = document.getElementById("datos_inventario");

    /* Hacer la peticion */
    const api = await fetch("http://localhost:8080/api/inventario", {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": `${token}`
        }
    });

    const result = await api.json();
    result.data.forEach(inventario => {
        datos_inventario.innerHTML += `
        <tr>
            <td>${inventario.noInventario}</td>
            <td>${inventario.descripcion}</td>
            <td>${inventario.marca}</td>
            <td>${inventario.modelo}</td>
            <td>${inventario.serie}</td>
            <td>${inventario.departamento}</td>
            <td>${inventario.responsable}</td>
            <td>${inventario.fechaAdquisicion}</td>
            <td>${inventario.valorAdquisicion}</td>
            <td>${inventario.estado}</td>
            <td> <button class='btn_seleccionar' id='${inventario.noInventario}'>Seleccionar</button> </td>
        </tr>
        `;
    });

    $('#tabla_inventario').DataTable({
        columnDefs: [
            { width: '10%', target: [0] },
            { width: '25%', target: [1] },
            { width: '15%', target: [5] },
            { width: '20%', target: [6] }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-MX.json',
        }
    });

    /*---------------------------------------------- 
        EVENTO AL PRESIONARL EL BOTON DE REGISTRO
    -----------------------------------------------*/
    document.getElementById("idRegistro").addEventListener("click", () => {
        let formulario = document.getElementById("formulario");
        formulario.classList.remove("ocultar");

        /* Ocultar boton de actualizar */
        let btn_actualizar = document.getElementById("btn_actualizar");
        btn_actualizar.classList.add("ocultar");

        /* Mostrar boton de registrar */
        let btn_registrar = document.getElementById("btn_registrar");
        btn_registrar.classList.remove("ocultar");

        /* Habilitar la casilla para que no pueda ser modificada */
        document.getElementById("numero_inventario").removeAttribute("disabled");

        /* Limpiar campos */
        document.getElementById("form").reset();
    });

    /* REGISTRAR INVENTARIO */
    document.getElementById("btn_registrar").addEventListener("click", async (e) => {
        e.preventDefault();

        let datos = {
            noInventario: document.getElementById("numero_inventario").value,
            descripcion: document.getElementById("descripcion").value,
            marca: document.getElementById("marca").value,
            modelo: document.getElementById("modelo").value,
            serie: document.getElementById("serie").value,
            departamento: document.getElementById("departamento").value,
            responsable: document.getElementById("responsable").value,
            fechaAdquisicion: document.getElementById("fecha_adquisicion").value,
            valorAdquisicion: document.getElementById("precio_adquisicion").value,
            estado: document.getElementById("status").value
        }
        const registroApi = await fetch("http://localhost:8080/api/registro", {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `${token}`
            }
        });

        const res = await registroApi.json();

        if (res.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'HECHO!',
                text: 'Datos guardados correctamente!'
            });
            /* Vaciar campos */
            document.getElementById("form").reset();

            /* Recasrgar página */
            let confirm = document.querySelector(".swal2-confirm");
            confirm.addEventListener("click", () => {
                location.reload();
            });
        }
        else if (res.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'ERROR!',
                text: 'Hubo un error al guardar el registro...'
            });
        }
        else if (res.status === 'duplicado') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'Numero de inventario repetido'
            });
        }
        else if (res.status === 'vacio') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'Faltan campos por llenar...'
            });
        }
        else if (res.status === 'fechaPosterior') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'La fecha no puede ser posterior a hoy'
            });
        }
        else if (res.status === 'negativo') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'Precio incorrecto'
            });
        }
    });

    /*------------------------------------------------- 
        EVENTO AL PRECIONAR EL BOTON DE SELECCIONAR
    -------------------------------------------------*/
    let botonesSeleccionar = document.querySelectorAll(".btn_seleccionar");
    botonesSeleccionar.forEach(botonSeleccion => {
        botonSeleccion.addEventListener("click", async (e) => {
            /* Mostrar formulario y boton de actualizar*/
            let formulario = document.getElementById("formulario");
            formulario.classList.remove("ocultar");
            let btn_actualizar = document.getElementById("btn_actualizar");
            btn_actualizar.classList.remove("ocultar");

            /* Deshabilitar la casilla para que no pueda ser modificada */
            document.getElementById("numero_inventario").setAttribute("disabled", null);

            /* Ocultar boton de registrar */
            let btn_registrar = document.getElementById("btn_registrar");
            btn_registrar.classList.add("ocultar");

            let parametro = botonSeleccion.id;
            const apiSeleccionar = await fetch(`http://localhost:8080/api/inventario/${parametro}`, {
                method: 'GET',
                headers: {
                    "Authorization": `${token}`
                }
            });

            const data = await apiSeleccionar.json();
            if (data.status === 'success') {
                data.data.forEach(datos => {
                    document.getElementById("numero_inventario").value = datos.noInventario;
                    document.getElementById("descripcion").value = datos.descripcion;
                    document.getElementById("marca").value = datos.marca;
                    document.getElementById("modelo").value = datos.modelo;
                    document.getElementById("serie").value = datos.serie;
                    document.getElementById("departamento").value = datos.departamento;
                    document.getElementById("responsable").value = datos.responsable;
                    document.getElementById("fecha_adquisicion").value = datos.fechaAdquisicion;
                    document.getElementById("precio_adquisicion").value = datos.valorAdquisicion;
                    document.getElementById("status").value = datos.estado;
                });
            }
            else if (data.status === 'error') {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR!',
                    text: 'El registro no existe'
                });
            }
        });
    });

    /*--------------------------------------------------
        EVENTO AL PRESIONAR EL BOTON DE ACTUALIZAR
    --------------------------------------------------*/
    document.getElementById("btn_actualizar").addEventListener("click", async (e) => {
        e.preventDefault();
        let datos = {
            noInventario: document.getElementById("numero_inventario").value,
            descripcion: document.getElementById("descripcion").value,
            marca: document.getElementById("marca").value,
            modelo: document.getElementById("modelo").value,
            serie: document.getElementById("serie").value,
            departamento: document.getElementById("departamento").value,
            responsable: document.getElementById("responsable").value,
            fechaAdquisicion: document.getElementById("fecha_adquisicion").value,
            valorAdquisicion: document.getElementById("precio_adquisicion").value,
            estado: document.getElementById("status").value
        }
        const modificarApi = await fetch("http://localhost:8080/api/modificar", {
            method: 'PUT',
            body: JSON.stringify(datos),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `${token}`
            }
        });
        const result = await modificarApi.json();

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'ACTUALIZADO!',
                text: 'Datos modificados correctamente!'
            });
            /* Vaciar campos */
            document.getElementById("form").reset();

            /* Recasrgar página */
            let confirm = document.querySelector(".swal2-confirm");
            confirm.addEventListener("click", () => {
                location.reload();
            });
        }
        else if (result.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'ERROR!',
                text: 'Error al modificados los datos'
            });
        }
    });
});
