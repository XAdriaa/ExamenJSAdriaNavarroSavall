/**
 * reserva.js
 * Desarrollador: Senior Dev / Corrector 2º DAW
 * Propósito: Leer el coche seleccionado en localStorage, pintarlo en la reserva y validar el formulario con validaciones nativas de HTML5 JS.
 */

document.addEventListener("DOMContentLoaded",main);

function main() {
    // 1. Obtener coche sin depender del DOM, usando localStorage
    let cocheGuardadoStr = localStorage.getItem("cocheSeleccionado");
    
    // Si accedemos a reserva.html directamente sin elegir coche, redirigimos.
    if (!cocheGuardadoStr) {
        window.location.href = "index.html";
        return;
    }

    let coche = JSON.parse(cocheGuardadoStr);

    // 2. Pintar Coche en el DOM
    renderCarDetails(coche);

    // 3. Forzar los patrones OBLIGATORIOS en el formulario JS por seguridad, antes de validar.
    setPatronesObligatorios();

    // 4. Configurar listener de validación
    document.getElementById("enviar").addEventListener("click", validateForm);
}

/**
 * Función para vaciar elementos sin usar innerHTML ni textContent
 */
function vaciarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

/**
 * Rellena los huecos vacíos de reserva.html utilizando únicamente manipulación de nodos
 */
function renderCarDetails(coche) {
    // Ubicamos los nodos donde inyectaremos el texto (no tienen id específico)
    let cardTitle = document.querySelector(".card-title");
    let precioNodo = document.querySelector(".font-weight-bold");
    let imgCoche = document.querySelector(".card-img-top");
    let celdasCaracteristicas = document.querySelectorAll(".col.p-3.text-center strong");

    // Insertar Imagen
    imgCoche.setAttribute("src", "img/" + coche.img);
    imgCoche.setAttribute("alt", coche.marca + " " + coche.modelo);

    // Insertar Textos
    cardTitle.appendChild(document.createTextNode(coche.marca + " " + coche.modelo));
    
    let precioFormat = new Intl.NumberFormat('es-ES').format(coche.precio) + " €";
    precioNodo.appendChild(document.createTextNode(precioFormat));

    // El array celdasCaracteristicas tiene longitud 4 en el HTML proporcionado (Año, Km, Cambio, Combustible)
    if (celdasCaracteristicas.length >= 4) {
        celdasCaracteristicas[0].appendChild(document.createTextNode(coche.anyo));
        celdasCaracteristicas[1].appendChild(document.createTextNode(coche.km + " Km."));
        celdasCaracteristicas[2].appendChild(document.createTextNode(coche.cambio));
        celdasCaracteristicas[3].appendChild(document.createTextNode(coche.combustible));
    }
}

/**
 * Inserta las Expresiones Regulares críticas dentro del DOM como atributo Pattern, 
 * asegurándonos de que se cumplan las reglas exactas del examen.
 */
function setPatronesObligatorios() {
    document.getElementById("nombreApellidos").setAttribute("pattern", "^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{4,40}$");
    document.getElementById("dniCifNia").setAttribute("pattern", "^(\\d{8}[A-Z]|[A-Z]\\d{8}|X\\d{7}[A-Z])$");
    document.getElementById("email").setAttribute("pattern", "^[^\\s@]+@[^\\s@]+\\.[a-zA-Z]{2,}$");
    document.getElementById("telefono").setAttribute("pattern", "^\\(\\d{3}\\)\\s\\d{3}-\\d{3}$");
}

/**
 * Valida el formulario utilizando checkValidity() y logic de validity OBLIGATORIAMENTE
 */
function validateForm(e) {
    e.preventDefault();

    let errorContainer = document.getElementById("errorMensaje");
    vaciarElemento(errorContainer);

    let inputsAValidar = [
        { id: "nombreApellidos", nombreLegible: "Nombre y Apellidos" },
        { id: "dniCifNia", nombreLegible: "DNI, CIF o NIA" },
        { id: "email", nombreLegible: "Email" },
        { id: "telefono", nombreLegible: "Teléfono" }
    ];

    let formularioValido = true;

    // Recorremos los inputs aplicando la lógica estricta demandada en la rúbrica
    for (let i = 0; i < inputsAValidar.length; i++) {
        let inputDOM = document.getElementById(inputsAValidar[i].id);
        
        if (!inputDOM.checkValidity()) {
            formularioValido = false;
            let msgError = "";

            if (inputDOM.validity.valueMissing) {
                msgError = `El campo ${inputsAValidar[i].nombreLegible} está vacío y es obligatorio.`;
            } else if (inputDOM.validity.patternMismatch) {
                msgError = `El campo ${inputsAValidar[i].nombreLegible} no cumple con el formato exigido.`;
            } else {
                msgError = `El campo ${inputsAValidar[i].nombreLegible} es inválido.`;
            }

            mostrarMensajeError(errorContainer, msgError);
        }
    }

    // Validar checkbox de aceptación a parte
    let checkAceptar = document.getElementById("aceptar");
    if (!checkAceptar.checked) {
        formularioValido = false;
        mostrarMensajeError(errorContainer, "Debes aceptar las condiciones de uso de este sitio obligatoriamente.");
    }

    // Si todo es correcto, guardamos y redirigimos
    if (formularioValido) {
        saveReservation();
    }
}

/**
 * Función auxiliar para inyectar mensajes de error sin usar innerHTML
 */
function mostrarMensajeError(contenedor, mensaje) {
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(mensaje));
    contenedor.appendChild(p);
}

/**
 * Consolida el objeto completo de reserva en LocalStorage y redirige al index.
 */
function saveReservation() {
    let cocheOriginalStr = localStorage.getItem("cocheSeleccionado");

    // Construcción del objeto de reserva completo con datos del formulario
    let reservaConfirmada = {
        cocheReserva: JSON.parse(cocheOriginalStr),
        datosCliente: {
            nombre: document.getElementById("nombreApellidos").value,
            documento: document.getElementById("dniCifNia").value,
            email: document.getElementById("email").value,
            telefono: document.getElementById("telefono").value,
            nota: document.getElementById("nota").value
        },
        fechaReserva: new Date().toLocaleDateString()
    };

    // Serializamos y almacenamos
    localStorage.setItem("reserva_" + reservaConfirmada.datosCliente.documento, JSON.stringify(reservaConfirmada));
    
    // Eliminamos el coche en curso para limpiar la sesión
    localStorage.removeItem("cocheSeleccionado");

    // Redirigimos a inicio exitosamente
    window.location.href = "index.html";
}