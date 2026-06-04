document.addEventListener("DOMContentLoaded", main);
function main() {


prepararEvents();


}

// Muestra un mensaje de error en el elemento especificado
function error(element, missatge) {
    const alerta = document.getElementById("errorMensaje");
    alerta.textContent = missatge;
    element.classList.add("text-danger");
    element.focus();
}

// Limpia todos los mensajes de error
function esborrarError() {
    document.getElementById("errorMensaje").textContent = "";
    const inputs = document.querySelectorAll("input, textarea, select");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove("text-danger");
    }
}


function validarNom() {
    const element = document.getElementById("nombreApellidos");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has de introducir un nombre");
        } else if (element.validity.patternMismatch) {
            error(element, "El nombre solo puede tener entre 4 i 40 caracteres");
        }
        return false;
    }
    return true;
}

function validarDNI() {
    const element = document.getElementById("dniCifNia");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un DNI, CIF o NIA");
        } else if (element.validity.patternMismatch) {
            error(element, "El DNI, CIF o NIA tiene que coincidir con el formato adecuado.");
        }
        return false;
    }
    return true;
}

function validarEmail() {
    const element = document.getElementById("email");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un correo electrónico");
        } else if (element.validity.patternMismatch) {
            error(element, "El correo electrónico tiene que tener el formato ejemplo@dominio.com");
        }
        return false;
    }
    return true;
}

function validarTlf() {
    const element = document.getElementById("telefono");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un teléfono");
        } else if (element.validity.patternMismatch) {
            error(element, "El número de teléfono tiene que tener el formato (999) 666-333");
        }
        return false;
    }
    return true;
}

function validarOK() {
    const element = document.getElementById("aceptar");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has de aceptar los terminos y condiciones");
        } else if (element.validity.patternMismatch) {
            error(element, "El correo electrónico tiene que tener el formato ejemplo@dominio.com");
        }
        return false;
    }
    return true;
}



function validar(e) {
    e.preventDefault();
    esborrarError()
    if (validarNom() && validarDNI() && validarEmail() && validarTlf() && validarOK()) {
        console.log("todo bien");
        return true;
    } else {
        return false;
    }
}



function prepararEvents() {
 
    document.getElementById('enviar').addEventListener('click', validar);

}