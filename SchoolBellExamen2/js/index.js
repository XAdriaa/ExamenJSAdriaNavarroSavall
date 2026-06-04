document.addEventListener("DOMContentLoaded", main);

async function main() {
    await extraerDatos();

    document.getElementById("enviar").addEventListener("click", validar, false);

    pintarLocal();

}

async function extraerDatos() {
    try {
        const res = await fetch('./data/data.json');


        if (!res.ok) {
            throw new error("Error en la extraccion de lo datos");
        };

        const data = await res.json();

        console.log(data);

        localStorage.setItem("data", JSON.stringify(data));

    } catch (error) {
        console.log('Error-consulta:', error.message);
    }
}

function pintarLocal() {
    let dataLocal = JSON.parse(localStorage.getItem("data"));
    let dataSchedule = dataLocal.schedules


    let horario = dataSchedule[0]

    console.log("Extrau Local", horario.times);

    const table = document.getElementById("table");

    horario.times.forEach(element => {
        const tr = document.createElement("tr");

        const tdID = document.createElement("td")
        const NodeID = document.createTextNode(element.id);
        tdID.appendChild(NodeID);

        const tdNombre = document.createElement("td")
        const NodeNombre = document.createTextNode(element.name);
        tdNombre.appendChild(NodeNombre);

        const tdHora = document.createElement("td")
        const NodeHora = document.createTextNode(element.hour);
        tdHora.appendChild(NodeHora);

        const tdDuracion = document.createElement("td")
        const NodeDuracion = document.createTextNode(element.duration);
        tdDuracion.appendChild(NodeDuracion);

        const tdCancion = document.createElement("td")
        const NodeCancion = document.createTextNode(nombreCancion(element.songId));
        tdCancion.appendChild(NodeCancion);

        const tdAccion = document.createElement("td")
        const btnEliminar = document.createElement("button");
        const Nodebtn = document.createTextNode("Borrar");
        btnEliminar.classList.add("btn", "btn-outline-danger");
        btnEliminar.addEventListener("click", console.log("Descomentar y probar"));

        btnEliminar.appendChild(Nodebtn);
        tdAccion.appendChild(btnEliminar);

        tr.appendChild(tdID);
        tr.appendChild(tdNombre);
        tr.appendChild(tdHora);
        tr.appendChild(tdDuracion);
        tr.appendChild(tdCancion)
        tr.appendChild(tdAccion);

        table.appendChild(tr);
    });


}

function nombreCancion(id) {
    let dataLocal = JSON.parse(localStorage.getItem("data"));

    let playList = dataLocal.playlists[0].songs;

    let nombreCancion

    playList.forEach(element => {
        if (id === element.id) {
            nombreCancion = element.name
        }
    });



    console.log("playList disponibles", nombreCancion)

    return nombreCancion;
}

//  function borrarDades(event, idbtn){
//
//      event.preventDefault();
//
//     const id = Number(idbtn)
//
//      console.log(id);
//  }


function validarNombre() {

    let element = document.getElementById("timeName");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom ha de tindre entre 2 i 50 caracters.");
        }
        return false;
    }
    return true;

}

function validarHora() {

    let element = document.getElementById("timeHour");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr una hora.");
        }
        if (element.validity.patternMismatch) {
            error(element, "Error de patron");
        }
        return false;
    }
    return true;

}

function validarDuracion() {

    let element = document.getElementById("timeDuration");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr una duracio.");
        }
        if (element.validity.patternMismatch) {
            error(element, "Error de patron");
        }
        return false;
    }
    return true;

}

function validarCancion() {

    let element = document.getElementById("timeSongSelect");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr una cancion.");
        }
        if (element.validity.patternMismatch) {
            error(element, "Error de patron");
        }
        return false;
    }
    return true;

}

function validar(e) {
    esborrarError();
    e.preventDefault();
    if (validarNombre() && validarHora() && validarDuracion() && validarCancion()) {
        document.getElementById("formulario-producto").requestSubmit();
        return true;
    } else {
        return false;
    }
}

function error(element, missatge) {
    let miss = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("text-danger");
    element.focus();
}

function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("text-danger");
    }
}