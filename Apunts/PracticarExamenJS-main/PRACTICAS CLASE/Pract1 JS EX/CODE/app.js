//Espera a que todo el HTML esté cargado antes de ejecutar el código.
//DOMContentLoaded se dispara cuando el DOM ya puede leerse correctamente.
document.addEventListener("DOMContentLoaded", main);


//Función principal asíncrona del programa.
async function main(){

    //Espera a que se descarguen y guarden los datos del JSON.
    await extraerData();

    //Pinta la tabla con los datos guardados.
    pintTaule();

    //Obtiene el formulario del HTML mediante su id.
    const form = document.getElementById("idForm");

    //Escucha el evento submit del formulario.
    //Cuando se envía el formulario se ejecuta guardarDades() i validar().
    form.addEventListener("submit", (event) => {
    event.preventDefault();
    esborrarError();

    if (!validarFecha() || !validarDH() || !validarImporte() || !validarConcepte()) return;

    guardarDades(event);
    document.getElementById("idForm").reset();
});

}


/**
 * Función asíncrona que obtiene los datos del archivo JSON.
 */
async function extraerData() {

    //Bloque try para controlar posibles errores.
    try {

        //'fetch' realiza una petición HTTP al archivo JSON.
        const res = await fetch('./bd/bd.json');

        //Comprueba si la respuesta fue correcta.
        //Si NO fue correcta lanza un error manual.
        if (!res.ok) {

            throw new Error('No se ha podido obtener el archivo');

        }

        //Convierte la respuesta JSON a objeto JavaScript.
        const data = await res.json();

        //Muestra los datos por consola.
        console.log(data);
        
        let oldData = localStorage.getItem("dataLocal");

        if(oldData === null){
            // Si no existe data, usar la del JSON
            localStorage.setItem("dataLocal", JSON.stringify(data));
        }



    } catch (error) {

        //Captura cualquier error del try.
        console.error('Error-consulta:', error.message);

    }
}


//Función que guarda nuevos datos introducidos por el usuario.
function guardarDades(event) {

    //Evita que el formulario recargue la página automáticamente.
    event.preventDefault();

    //Obtiene el valor del input fecha.
    const fecha = document.getElementById("fecha").value;
    const concepto = document.getElementById("concepto").value;
    const selectDH = document.getElementById("selectDH").value;
    const importe = document.getElementById("importe").value;

    

    //Crea un objeto con los datos del formulario.
    const money = {

        //Genera un id único usando la fecha actual en milisegundos.
        id: Date.now(),
        fecha,
        concepto,
        tipo_asiento: selectDH,
        //Convierte el importe a número decimal.
        importe : parseFloat(importe)

    };

    let dataOld = localStorage.getItem("dataLocal");
    let dataNew = money;

    //Comprueba si no existe información en localStorage.
    if(dataOld === null ){
        let asientos_contables = [dataNew];
        localStorage.setItem("dataLocal", JSON.stringify({asientos_contables}));
    } else {
        dataOld = JSON.parse(dataOld);
        //Añade el nuevo objeto al array.
        dataOld.asientos_contables.push(dataNew);
        localStorage.setItem("dataLocal", JSON.stringify(dataOld));
    }

    console.log("Datos guardados");

    //Vuelve a pintar la tabla actualizada.
    pintTaule();


}


//Función encargada de pintar la tabla HTML.
function pintTaule() {

    //Obtiene los datos del localStorage.
    const dataTableRaw = localStorage.getItem("dataLocal");

    //Convierte el string JSON a objeto y accede al array.
    const dataTable = JSON.parse(dataTableRaw).asientos_contables;

    //Obtiene el tbody de la tabla.
    const taule = document.getElementById('idTbody');

    //Mientras exista algún hijo dentro del tbody...
    while (taule.firstChild) {
        //Elimina el primer hijo.
        //Esto limpia completamente la tabla.
        taule.removeChild(taule.firstChild);

    }

    //Ordenar por fecha
    let ordenado = dataTable.sort((a,b) => new Date(a.fecha) - new Date(b.fecha))


    //Variable que almacenará el saldo acumulado.
    let saldo = 0;

    //Recorre cada elemento del array.
    ordenado.forEach(element => {

        //Si el tipo es Haber suma el importe.
        if (element.tipo_asiento === "Haber"){
            saldo += element.importe;
        } else
            //Si no es Haber, resta el importe.
            saldo -= element.importe;
        
        //Crea una fila <tr>.
        const fila = document.createElement("tr");

        //================ BOTÓN BORRAR =================//
        //Crea celda para el botón.
        const btncelda = document.createElement("td");
        //Crea botón.
        const btn = document.createElement("button");
        btn.classList.add("btn","btn-light");
        //Crea el texto "Borrar".
        const btnNode = document.createTextNode('Borrar');
        //Guarda el id del elemento dentro del botón.
        btn.dataset.id = element.id
        //Añade evento click al botón.
        btn.addEventListener("click", borrarDades)
        //Añade el texto al botón.
        btn.appendChild(btnNode);
        //Añade el botón a la celda.
        btncelda.appendChild(btn);
        //Añade la celda a la fila.
        fila.appendChild(btncelda);

        //================ CELDA FECHA =================//
        const fechacelda = document.createElement("td");
        const fecha = document.createElement("p");
        const fechaFormateada = new Date(element.fecha + "T00:00:00").toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        }); //Formato de fecha dd/mm/aa
        const fechaNode = document.createTextNode(fechaFormateada);

        fecha.appendChild(fechaNode);
        fechacelda.appendChild(fecha);
        fila.appendChild(fechacelda);


        //================ CELDA CONCEPTO =================//
        const conceptoCelda = document.createElement("td");
        const concepto = document.createElement("p");
        const conceptoNode = document.createTextNode(element.concepto);

        concepto.appendChild(conceptoNode);
        conceptoCelda.appendChild(concepto);
        fila.appendChild(conceptoCelda);


        //================ CELDA DEBE/HABER =================//
        const dhCelda = document.createElement("td");
        const dh = document.createElement("p");
        const dhNode = document.createTextNode(element.tipo_asiento);


        dh.appendChild(dhNode);
        dhCelda.appendChild(dh);
        fila.appendChild(dhCelda);

        //================ CELDA IMPORTE =================//
        const importeCelda = document.createElement("td");
        const importe = document.createElement("p");
        const importeNode = document.createTextNode(element.importe);

        importe.appendChild(importeNode);
        importeCelda.appendChild(importe);
        fila.appendChild(importeCelda);

        //================ CELDA SALDO =================//
        const saldoCelda = document.createElement("td");
        const saldoEt = document.createElement("p");
        const saldoNode = document.createTextNode(saldo);

        saldoEt.appendChild(saldoNode);
        saldoCelda.appendChild(saldoEt);
        fila.appendChild(saldoCelda);


        //Añade la fila completa al tbody.
        taule.appendChild(fila);

    });
}


//Función encargada de borrar datos.
function borrarDades(event){
    event.preventDefault();

    //Obtiene y convierte los datos del localStorage.
    let dadaLocal = JSON.parse(localStorage.getItem("dataLocal"));

    //Obtiene el id del botón pulsado.
    const id = Number(event.target.dataset.id);

    
    //Crea un nuevo array eliminando el elemento cuyo id coincida.
    dadaLocal.asientos_contables = dadaLocal.asientos_contables.filter(

        //Mantiene todos los elementos cuyo id sea distinto.
        element => element.id !== id

    );

    localStorage.setItem("dataLocal", JSON.stringify(dadaLocal));

    //Repinta la tabla actualizada.
    pintTaule();
}

//Funcion para validar la fecha
function validarFecha() {
    const element = document.getElementById("fecha");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Tens que introduir una data.");
        }
        return false;
    }
    return true;
}

//Funcion para validar el concepto
function validarConcepte() {
    const element = document.getElementById("concepto");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Tens que introduir un concepte.");
        }
        return false;
    }
    return true;
}

//Funcion para validar Debe/Haber
function validarDH() {
    const element = document.getElementById("selectDH");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Tens que seleccionar Debe o Haber.");
        }
        return false;
    }
    return true;
}

//Funcion para validar el importe
function validarImporte() {
    const element = document.getElementById("importe");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Tens que introduir un import.");
        }
        if (element.validity.rangeUnderflow) {
            error(element, "L'import no pot ser negatiu.");
        }
        return false;
    }
    return true;
}

//Funcion principal de validacion
function validar(event) {
    esborrarError();
    if (validarFecha() && validarDH() && validarImporte() && validarConcepte()) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}

function error (element, missatge){
    let miss=document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

function esborrarError (){
    document.getElementById("missatgeError").textContent="";
    let formulari = document.forms[0];
        for ( let i=0; i < formulari.elements.length; i++){
            formulari.elements[i].classList.remove("error");
        }
}