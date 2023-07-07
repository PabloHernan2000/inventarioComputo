/*-------------------------------------------------------- 
    VERIFICAR SI EL USUARIO TIENE UNA SESIÓIN ABIERTA
---------------------------------------------------------*/
/* Obtener token */
const token = localStorage.getItem("token");

if (token) {
    window.location.href = "inventario.html";
}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn_ingresar").addEventListener("click", async (e) => {
        e.preventDefault();

        let datosLogin = {
            usuario: document.getElementById("user").value,
            contrasenia: document.getElementById("password").value
        }

        const apiLogin = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            body: JSON.stringify(datosLogin),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        });

        const result = await apiLogin.json();
        /* console.log(result) */

        /* Si hay errores */
        if (result.status === 'vacio') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'Faltan campos por llenar...'
            });
        }
        else if (result.status === 'noExiste') {
            Swal.fire({
                icon: 'warning',
                title: 'ERROR!',
                text: 'El usuario no existe'
            });
        }
        else if(result.status === 'error'){
            Swal.fire({
                icon: 'Error',
                title: 'ERROR!',
                text: 'Error al iniciar sesión'
            });
        }

        /* Guardar el token en el local storage */
        const token = result.token;
        localStorage.setItem("token", token);

        window.location.href = "inventario.html";

    })

});