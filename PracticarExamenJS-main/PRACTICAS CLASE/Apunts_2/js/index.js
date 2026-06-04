document.addEventListener("DOMContentLoaded", main);

function main() {

    dadesOriginals = [];
    dadesActuals = [];

    ordreActual = 'relevancia';
    carregarFamiliesDeBBDD();
    prepararEvents();
    prepararAutocomplete(dadesOriginals);

  
}
/*****************************************************
 * VARIABLES GLOBALS
 *****************************************************/

let dadesOriginals;
let dadesActuals;
let ordreActual;
const CLAU_STORAGE = 'cars'; // Clau per al localStorage

function carregarFamiliesDeBBDD() {
    const guardades = localStorage.getItem(CLAU_STORAGE);
    console.log("Cargando familias de BBDD...");


    // Carga los datos del archivo externo TendaFakeDades.js
    if (typeof data.cars !== "undefined" && Array.isArray(data.cars)) {
        console.log("Datos cargados de bbdd.js:", data.cars);

        data.cars.forEach(function (f) {
            dadesOriginals.push({
                marca: f.marca,
                modelo: f.modelo,
                precio: f.precio,
                anyo: f.anyo,
                km: f.km,
                cambio: f.cambio,
                combustible: f.combustible,
                img: f.img

            });
        });

        // Guarda una copia en el almacenamiento local del navegador
        localStorage.setItem("families", JSON.stringify(dadesOriginals));

        // Faig una còpia per a la manipulació (filtres, ordenació)
        dadesActuals = dadesOriginals.slice();

        // Finalment, pinte el llistat a la pàgina
        pintarLlistat(dadesActuals);
    } else {
        console.error("ERROR: No se pudo cargar Cars de bbdd.js");
    }
}


/*****************************************************
 * PINTAR DADES EN EL DOM (FORMA CORRECTA D'EXAMEN)
 *****************************************************/

function pintarLlistat(arrayDades) {

    const contenidor = document.getElementById('listado');

    while (contenidor.firstChild) {
        contenidor.removeChild(contenidor.firstChild);
    }

    // Ara jo recórrec totes les dades
    arrayDades.forEach(function (element) {
        // Jo cree el contenidor principal de cada item
        const div = document.createElement('div');
        div.classList.add('card');
        div.classList.add('mb-4');

        const div2 = document.createElement('div');
        div2.classList.add('card-body');

        const foto = document.createElement('img');
        foto.src = "../img/" + element.img;
        foto.appendChild(document.createTextNode(element.img));
        foto.classList.add('card-img-top');

        // Jo cree un títol
        const marcaModelo = document.createElement('h2');
        marcaModelo.appendChild(document.createTextNode(element.marca + " " + element.modelo));
        marcaModelo.classList.add("card-title");

        const div3 = document.createElement('div');
        div3.classList.add('row');
        div3.classList.add('justify-content-end');

        const div4 = document.createElement('div');
        div4.classList.add("p-2", "mb-1", "col-md-3", "offset-md-3", "bg-warning", "rounded", "text-center");

        const precio = document.createElement('h2');
        precio.appendChild(document.createTextNode(element.precio + " €"));
        precio.classList.add("font-weight-bold");

        const div5 = document.createElement('div');
        div5.classList.add('row');

        const añoNOM = document.createElement('div');
        añoNOM.appendChild(document.createTextNode("Año"));
        añoNOM.classList.add("col", "p-3", "text-center", "border-bottom", "border-dark");

        const KilometrosNOM = document.createElement('div');
        KilometrosNOM.appendChild(document.createTextNode("Kilometros"));
        KilometrosNOM.classList.add("col", "p-3", "text-center", "border-bottom", "border-dark");

        const CambioNOM = document.createElement('div');
        CambioNOM.appendChild(document.createTextNode("Cambio"));
        CambioNOM.classList.add("col", "p-3", "text-center", "border-bottom", "border-dark");

        const CombustibleNOM = document.createElement('div');
        CombustibleNOM.appendChild(document.createTextNode("Combustible"));
        CombustibleNOM.classList.add("col", "p-3", "text-center", "border-bottom", "border-dark");

        const raro = document.createElement("div");
        raro.appendChild(document.createTextNode(""));
        raro.classList.add("w-100");


        const año = document.createElement('div');
        año.appendChild(document.createTextNode(element.anyo));
        año.classList.add("col", "p-3", "text-center");

        const km = document.createElement('div');
        km.appendChild(document.createTextNode(element.km));
        km.classList.add("col", "p-3", "text-center");

        const cambio = document.createElement('div');
        cambio.appendChild(document.createTextNode(element.cambio));
        cambio.classList.add("col", "p-3", "text-center");

        const combustible = document.createElement('div');
        combustible.appendChild(document.createTextNode(element.combustible));
        combustible.classList.add("col", "p-3", "text-center");

        const reservar = document.createElement('a');
        reservar.appendChild(document.createTextNode("Reservar"));
        reservar.classList.add("btn", "btn-primary", "m-3");
        reservar.addEventListener("click", (e) => {window.location.href='reserva.html';});


        // Jo afegisc tots els elements al div
        div.appendChild(foto);
        div2.appendChild(marcaModelo);
        div4.appendChild(precio)
        div5.appendChild(añoNOM);
        div5.appendChild(KilometrosNOM);
        div5.appendChild(CambioNOM);
        div5.appendChild(CombustibleNOM);;
        div5.appendChild(raro);
        div5.appendChild(año);
        div5.appendChild(km);
        div5.appendChild(cambio);
        div5.appendChild(combustible);
        div5.appendChild(reservar);

        // Finalment jo afegisc el div al contenidor principal
        contenidor.appendChild(div);
        contenidor.appendChild(div2);
        contenidor.appendChild(div3);
        contenidor.appendChild(div4);
        contenidor.appendChild(div5);

    });
}
/*****************************************************
 * EVENTS
 *****************************************************/

function prepararEvents() {
 
    document.getElementById('precioAlto').addEventListener('click', ordenarDesc);
    document.getElementById('precioBajo').addEventListener('click', ordenarAsc);
    document.getElementById('relevancia').addEventListener('click', tornarARelevancia);
    document.getElementById('eliminarFiltro').addEventListener('click',eliminarFiltres);
    document.getElementById('filtrar').addEventListener('click',aplicarFiltresKm);
    document.getElementById('filtrar').addEventListener('click',aplicarFiltres);



}


/*****************************************************
 * ORDENACIÓ (ASCENDENT, DESCENDENT I RELEVÀNCIA)
 *****************************************************/

function ordenarAsc() {                            // Defineix la funció per ordenar ascendentment
    dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
        return Number(a.precio) - Number(b.precio);   // Converteix preu a número i resta per ordre ascendent
    });                                            // Tanca la funció sort
    ordreActual = 'asce';                          // Assigna 'asce' a la variable ordreActual
    pintarLlistat(dadesActuals);                   // Crida a la funció per pintar la llista actualitzada
}

function ordenarDesc() {                            // Defineix la funció per ordenar ascendentment
    dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
        return Number(b.precio) - Number(a.precio);   // Converteix preu a número i resta per ordre ascendent
    });                                            // Tanca la funció sort
    ordreActual = 'desc';
    pintarLlistat(dadesActuals);                   // Crida a la funció per pintar la llista actualitzada
}

function tornarARelevancia() {
    // Jo torne a l'ordre original del JSON / localStorage
    dadesActuals = dadesOriginals.slice();
    ordreActual = 'relevancia';
    pintarLlistat(dadesActuals);
}

function prepararAutocomplete(arrayDades) {
    // Agafem totes les marques i models en un sol array
    let valors = [];

    arrayDades.forEach(function (element) {
        valors.push(element.marca);
        valors.push(element.modelo);
    });

    valors = [...new Set(valors)];

    $('#marcaModelo').autocomplete({
        source: valors,
        select: function (event, ui) {
            filtrarPerMarcaOModel(ui.item.value);
        }
    });
}

function filtrarPerMarcaOModel(valor) {
    dadesActuals = dadesOriginals.filter(function (element) {
        return element.marca === valor || element.modelo === valor;
    });

    pintarLlistat(dadesActuals);
}
/*****************************************************
 * FILTRES (ROL, ANY, QUILÒMETRES, ETC.)
 *****************************************************/


function eliminarFiltres() {
  
    dadesActuals = dadesOriginals.slice();

    reaplicarOrdenacio();
    buidarCamps()
    pintarLlistat(dadesActuals);
}

function reaplicarOrdenacio() {
    // Esta funció evita duplicar codi
    if (ordreActual === 'asc') {
        ordenarAsc();
    } else if (ordreActual === 'desc') {
        ordenarDesc();
    }
}

function filtrarPerKm(kmDesde, kmFins) {
    dadesActuals = dadesOriginals.filter(function(cotxe) {

        const kmValid = cotxe.km >= kmDesde && cotxe.km <= kmFins;
        console.log("todo ok")

        return kmValid;
    });

    reaplicarOrdenacio();

    pintarLlistat(dadesActuals);
}

function aplicarFiltresKm() {

    const kmDesde = Number(document.getElementById('kmDesde').value);
    const kmFins = Number(document.getElementById('kmHasta').value);

    filtrarPerKm(kmDesde, kmFins);
}
function buidarCamps(){
    document.getElementById('marcaModelo').value = '';
}

function aplicarFiltres(event) {
    event.preventDefault();

    const valorRol = document.getElementById('combustible').value;

    dadesActuals = dadesOriginals.filter(function (element) {
        if (valorRol === '') {
            return true;
        }
        return element.combustible === valorRol;
    });

   
    reaplicarOrdenacio();

    pintarLlistat(dadesActuals);
}

