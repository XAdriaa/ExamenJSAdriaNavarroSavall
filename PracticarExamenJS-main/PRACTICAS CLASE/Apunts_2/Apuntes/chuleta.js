/*****************************************************
 * INICI OBLIGATORI DE L'EXAMEN
 *****************************************************/

document.addEventListener("DOMContentLoaded", main);

function main() {
    // Jo espere que el DOM estiga completament carregat
    // Açò és OBLIGATORI en l'examen

    // Esta funció main és el centre de tota l'aplicació
    // Si en l'examen em demanen una funció principal,
    // esta és exactament la que he d'utilitzar

    // IMPORTANT:
    // Estos arrays jo els adaptaré segons el nom real del JSON
    // (per exemple data.User, data.Product, data.Cars, etc.)
    dadesOriginals = [];
    dadesActuals = [];

    // Esta variable em permet recordar quina ordenació està activa
    ordreActual = 'relevancia';

    // Ací jo carregue el JSON (canviaré la ruta si cal)
    carregarJSON();

    // Ací jo prepare els events
    prepararEvents();
}


/*****************************************************
 * VARIABLES GLOBALS
 *****************************************************/

// Estes variables han d'estar fora de les funcions
// perquè jo les necessite en filtres, ordenacions, etc.
let dadesOriginals;
let dadesActuals;
let ordreActual;
const CLAU_STORAGE = 'cars'; // Clau per al localStorage


/*****************************************************
 * CARREGAR I TRACTAR EL JSON I LOCALSTORAGE
 *****************************************************/

function carregarJSON() {
    // Jo utilitze fetch per llegir el fitxer JSON
    // En l'examen pot ser un fitxer local o una URL
    fetch('dadesFAKE.json') // <- ací canviaré el nom si el JSON es diu diferent
        .then(function (resposta) {
            // Jo convertisc la resposta a JSON
            return resposta.json();
        })
        .then(function (data) {
            // MOLT IMPORTANT:
            // Ara NO assignem dadesOriginals directament
            // sinó que passem les dades a carregarDades,
            // que gestionarà localStorage i dades reals

            carregarDades(data);

            // Preparar filtres amb dades del JSON (pot ser diferent de localStorage)
            prepararFiltres(data);
        })
        .catch(function (error) {
            // Si alguna cosa falla, jo ho mostre per consola
            console.error('Error carregant el JSON', error);
        });
}

function carregarDades(data) {
    // Jo consulte si hi ha dades guardades en localStorage
    const guardades = localStorage.getItem(CLAU_STORAGE);

    if (!guardades) {
        // Si NO hi ha dades guardades, jo use les dades del JSON
        // IMPORTANT: adaptar 'User' segons el teu JSON i examen
        dadesOriginals = data.User;

        // I guarde aquesta informació al localStorage per persistència
        localStorage.setItem(
            CLAU_STORAGE,
            JSON.stringify(dadesOriginals)
        );
    } else {
        
        // Si hi ha dades guardades, jo les use
        dadesOriginals = JSON.parse(guardades);
    }

    // Faig una còpia per a la manipulació (filtres, ordenació)
    dadesActuals = dadesOriginals.slice();

    // Finalment, pinte el llistat a la pàgina
    pintarLlistat(dadesActuals);

    // I prepare l'autocomplete amb les dades reals
    prepararAutocomplete(dadesOriginals);
}


/*****************************************************
 * PINTAR DADES EN EL DOM (FORMA CORRECTA D'EXAMEN)
 *****************************************************/

function pintarLlistat(arrayDades) {
    // Ací jo pinte qualsevol llistat (usuaris, cotxes, productes...)

    // IMPORTANT:
    // He de canviar 'llistat' pel ID real del contenidor
    const contenidor = document.getElementById('llistat');

    // Abans de pintar, jo elimine TOT el contingut anterior
    // Ho faig així perquè NO puc usar innerHTML = ""
    while (contenidor.firstChild) {
        contenidor.removeChild(contenidor.firstChild);
    }

    // Ara jo recórrec totes les dades
    arrayDades.forEach(function (element) {
        // Jo cree el contenidor principal de cada item
        const div = document.createElement('div');
        div.classList.add('item'); // <- adaptar classe si cal

        // Jo cree un títol
        const titol = document.createElement('h3');
        titol.appendChild(document.createTextNode(element.name)); // <- canviar camp

        // Jo cree un paràgraf per a l'email o altra info
        const info = document.createElement('p');
        info.appendChild(document.createTextNode(element.email)); // <- canviar camp

        // Jo cree un span per a rol, categoria, preu, etc.
        const extra = document.createElement('span');
        extra.appendChild(document.createTextNode(element.rol)); // <- canviar camp

        

        // Jo afegisc tots els elements al div
        div.appendChild(titol);
        div.appendChild(info);
        div.appendChild(extra);

        // Finalment jo afegisc el div al contenidor principal
        contenidor.appendChild(div);
    });
}


/*****************************************************
 * ORDENACIÓ (ASCENDENT, DESCENDENT I RELEVÀNCIA)
 *****************************************************/

function ordenarAsc() {
    // Jo ordene de menor a major
    // El camp 'name' el canviaré per preu, any, km, etc.
    dadesActuals.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    // Jo guarde l'estat de l'ordenació
    ordreActual = 'asc';

    // Jo torne a pintar el llistat
    pintarLlistat(dadesActuals);
}

function ordenarDesc() {
    // Jo ordene de major a menor
    dadesActuals.sort(function (a, b) {
        return b.name.localeCompare(a.name);
    });

    ordreActual = 'desc';
    pintarLlistat(dadesActuals);
}

function tornarARelevancia() {
    // Jo torne a l'ordre original del JSON / localStorage
    dadesActuals = dadesOriginals.slice();
    ordreActual = 'relevancia';
    pintarLlistat(dadesActuals);
}

// function ordenarAsc() {                            // Defineix la funció per ordenar ascendentment
//     dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
//         return Number(a.preu) - Number(b.preu);   // Converteix preu a número i resta per ordre ascendent
//     });                                            // Tanca la funció sort
//     ordreActual = 'asce';                          // Assigna 'asce' a la variable ordreActual
//     pintarLlistat(dadesActuals);                   // Crida a la funció per pintar la llista actualitzada
// }                                                  // Tanca la funció ordenarAsc
//
// function ordenarDesc() {                           // Defineix la funció per ordenar descendentment
//     dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
//         return Number(b.preu) - Number(a.preu);   // Converteix preu a número i resta per ordre descendent
//     });                                            // Tanca la funció sort
//     ordreActual = 'desc';                          // Assigna 'desc' a la variable ordreActual
//     pintarLlistat(dadesActuals);                   // Crida a la funció per pintar la llista actualitzada
// }                                                  // Tanca la funció ordenarDesc


/*****************************************************
 * FILTRES (ROL, ANY, QUILÒMETRES, ETC.)
 *****************************************************/

function prepararFiltres(data) {
    // Exemple de com omplir un select dinàmicament
    // Canviaré 'filtreRol' pel select real de l'examen
    const select = document.getElementById('filtreRol');

    // Jo recórrec les categories o rols del JSON
    data.Category.forEach(function (cat) {
        const option = document.createElement('option');
        option.setAttribute('value', cat.name);
        option.appendChild(document.createTextNode(cat.name));
        select.appendChild(option);
    });
}

function aplicarFiltres() {
    // Ací jo combine tots els filtres
    const valorRol = document.getElementById('filtreRol').value;

    dadesActuals = dadesOriginals.filter(function (element) {
        // Si no hi ha filtre seleccionat, jo deixe passar tot
        if (valorRol === '') {
            return true;
        }
        // Si hi ha filtre, jo compare el camp corresponent
        return element.rol === valorRol;
    });

    // IMPORTANT:
    // Després de filtrar, jo respecte l'ordenació activa
    reaplicarOrdenacio();

    // I torne a pintar
    pintarLlistat(dadesActuals);
}

function eliminarFiltres() {
    // Quan premen "Eliminar filtres"
    // Jo recupere totes les dades originals
    dadesActuals = dadesOriginals.slice();

    // Jo respecte l'ordenació que estava activa
    reaplicarOrdenacio();

    // Jo repinte el llistat
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


/*****************************************************
 * jQuery UI AUTOCOMPLETE
 *****************************************************/

function prepararAutocomplete(arrayDades) {
    // Jo cree un array només amb els valors a buscar
    const valors = arrayDades.map(function (element) {
        return element.name; // <- canviar pel camp necessari
    });

    // Jo inicialitze l'autocomplete
    $('#cercador').autocomplete({ // <- canviar ID si cal
        source: valors,
        select: function (event, ui) {
            // Quan l'usuari selecciona un valor
            filtrarPerNom(ui.item.value);
        }
    });
}

function filtrarPerNom(valor) {
    // Jo filtre exactament pel valor seleccionat
    dadesActuals = dadesOriginals.filter(function (element) {
        return element.name === valor;
    });

    pintarLlistat(dadesActuals);
}


/*****************************************************
 * VALIDACIÓ DE FORMULARIS (HTML5 + JS)
 *****************************************************/

function validarFormulari() {
    // Jo capture tots els errors en un array
    let errors = [];

    const email = document.getElementById('email').value;

    // Expressió regular d'email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
        errors.push("L'email no és correcte");
    }

    // Jo mostre els errors tots junts
    mostrarErrors(errors);

    // Si no hi ha errors, retorne true
    return errors.length === 0;
}

function mostrarErrors(errors) {
    // Jo mostre tots els errors en una sola caixa
    const contenidor = document.getElementById('missatgesError');

    while (contenidor.firstChild) {
        contenidor.removeChild(contenidor.firstChild);
    }

    errors.forEach(function (missatge) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(missatge));
        contenidor.appendChild(p);
    });
}


/*****************************************************
 * LOCALSTORAGE I RESERVES
 *****************************************************/

function guardarReserva(reserva) {
    // Jo convertisc l'objecte a JSON
    const reservaJSON = JSON.stringify(reserva);

    // Jo guarde la reserva en localStorage
    localStorage.setItem('reserva', reservaJSON);
}

function carregarReserva() {
    // Jo recupere la reserva guardada
    const reserva = localStorage.getItem('reserva');

    if (reserva !== null) {
        return JSON.parse(reserva);
    }

    return null;
}


/*****************************************************
 * EVENTS
 *****************************************************/

function prepararEvents() {
    // Ací jo relacione botons amb funcions
    // TOTS els IDs s'han d'adaptar a l'HTML real de l'examen

    document.getElementById('btnAsc').addEventListener('click', ordenarAsc);
    document.getElementById('btnDesc').addEventListener('click', ordenarDesc);
    document.getElementById('btnRel').addEventListener('click', tornarARelevancia);
    document.getElementById('btnFiltrar').addEventListener('click', aplicarFiltres);
    document.getElementById('btnEliminarFiltres').addEventListener('click', eliminarFiltres);
}
