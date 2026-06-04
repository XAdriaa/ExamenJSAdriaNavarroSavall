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

    // Ací jo carregue el JSON 
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
        dadesOriginals = data.Cars;

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
        titol.appendChild(document.createTextNode(element.marca)); // <- canviar camp

        // Jo cree un paràgraf per a l'email o altra info
        const info = document.createElement('p');
        info.appendChild(document.createTextNode(element.model)); // <- canviar camp

        const combustible = document.createElement('p');
        combustible.appendChild(document.createTextNode(element.combustible));

        const km = document.createElement('p');
        km.appendChild(document.createTextNode(element.quilometres + " km"));

        const any = document.createElement('p');
        any.appendChild(document.createTextNode("Any " + element.any));

        // Jo cree un span per a rol, categoria, preu, etc.
        const extra = document.createElement('p');
        extra.appendChild(document.createTextNode(element.preu + " €")); // <- canviar camp

        const eliminar = document.createElement('button');
        eliminar.appendChild(document.createTextNode('X'));
        eliminar.addEventListener('click', () => eliminarCotxePerId(element.id));

        

        // Jo afegisc tots els elements al div
        div.appendChild(titol);
        div.appendChild(info);
        div.appendChild(combustible);
        div.appendChild(km);
        div.appendChild(any);
        div.appendChild(extra);
        div.appendChild(eliminar);

        // Finalment jo afegisc el div al contenidor principal
        contenidor.appendChild(div);
    });
}


/*****************************************************
 * ORDENACIÓ (ASCENDENT, DESCENDENT I RELEVÀNCIA)
 *****************************************************/

function ordenarAsc() {                            // Defineix la funció per ordenar ascendentment
     dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
         return Number(a.preu) - Number(b.preu);   // Converteix preu a número i resta per ordre ascendent
     });                                            // Tanca la funció sort
     ordreActual = 'asce';                          // Assigna 'asce' a la variable ordreActual
     pintarLlistat(dadesActuals);                   // Crida a la funció per pintar la llista actualitzada
 }  

 function ordenarDesc() {                            // Defineix la funció per ordenar ascendentment
     dadesActuals.sort(function (a, b) {           // Ordena dadesActuals usant la funció de comparació
         return Number(b.preu) - Number(a.preu);   // Converteix preu a número i resta per ordre ascendent
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


/*****************************************************
 * FILTRES (ROL, ANY, QUILÒMETRES, ETC.)
 *****************************************************/

function prepararFiltres(data) {
    // Exemple de com omplir un select dinàmicament
    // Canviaré 'filtreRol' pel select real de l'examen
    const select = document.getElementById('filtreRol');

    // Jo recórrec les categories o rols del JSON
    data.Cars.forEach(function (cat) {
        const option = document.createElement('option');
        option.setAttribute('value', cat.combustible);
        option.appendChild(document.createTextNode(cat.combustible));
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
        return element.combustible === valorRol;
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

function filtrarPerAnyIKm(anyDesde, anyFins, kmDesde, kmFins) {
    dadesActuals = dadesOriginals.filter(function(cotxe) {
        // Comprove que l'any està dins del rang (incloent els extrems)
        const anyValid = cotxe.any >= anyDesde && cotxe.any <= anyFins;

        // Comprove que els quilòmetres estan dins del rang
        const kmValid = cotxe.quilometres >= kmDesde && cotxe.quilometres <= kmFins;

        // Només passe si complix amb ambdós filtres
        return anyValid && kmValid;
    });

    // Reaplique l'ordenació activa (si n'hi ha)
    reaplicarOrdenacio();

    // Torne a pintar la llista filtrada
    pintarLlistat(dadesActuals);
}

function aplicarFiltresAnyKm() {
    const anyDesde = Number(document.getElementById('anyDesde').value);
    const anyFins = Number(document.getElementById('anyFins').value);
    const kmDesde = Number(document.getElementById('kmDesde').value);
    const kmFins = Number(document.getElementById('kmFins').value);

    // Validacions bàsiques
    if (anyDesde > anyFins) {
        alert('El any "desde" ha de ser menor o igual que el "fins".');
        return;
    }
    if (kmDesde > kmFins) {
        alert('Els quilòmetres "desde" han de ser menor o igual que els "fins".');
        return;
    }

    filtrarPerAnyIKm(anyDesde, anyFins, kmDesde, kmFins);
    
}




/*****************************************************
 * jQuery UI AUTOCOMPLETE
 *****************************************************/

function prepararAutocomplete(arrayDades) {
    // Jo cree un array només amb els valors a buscar
    const valors = arrayDades.map(function (element) {
        return element.marca; // <- canviar pel camp necessari    
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
        return element.marca === valor;
    });

    pintarLlistat(dadesActuals);
}

//function prepararAutocomplete(arrayDades) {
//    // Agafem totes les marques i models en un sol array
//    let valors = [];
//
//    arrayDades.forEach(function(element) {
//        valors.push(element.marca);
//        valors.push(element.model);
//    });
//
    // Evitem duplicats
//    valors = [...new Set(valors)];
//
//    $('#cercador').autocomplete({
//        source: valors,
//        select: function(event, ui) {
//            filtrarPerMarcaOModel(ui.item.value);
//        }
//    });
//}
//
//function filtrarPerMarcaOModel(valor) {
//    dadesActuals = dadesOriginals.filter(function(element) {
//        return element.marca === valor || element.model === valor;
//    });
//
//    pintarLlistat(dadesActuals);
//}



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
 * CREAR COSAS
 *****************************************************/

// Valida que el nombre cumpla los requisitos
function validarMarca() {
    const element = document.getElementById("marca");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un nom de marca.");
        } else if (element.validity.patternMismatch) {
            error(element, "El nom només pot tindre lletres, números i espais, entre 3 i 100 caràcters.");
        } else if (element.validity.tooShort) {
            error(element, "El nom ha de tindre almenys 3 caràcters.");
        } else if (element.validity.tooLong) {
            error(element, "El nom no pot superar els 100 caràcters.");
        }
        return false;
    }
    return true;
}
// Muestra un mensaje de error en el elemento especificado
function error(element, missatge) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = missatge;
    element.classList.add("error");
    element.focus();
}
// Limpia todos los mensajes de error
function esborrarError() {
    document.getElementById("alerta").textContent = "";
    const inputs = document.querySelectorAll("input, textarea, select");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove("error");
    }
}

// Función principal de validación que ejecuta todas las validaciones
function validar(e) {
    e.preventDefault();
    esborrarError()
    if (validarMarca()) {
        afegirCotxe();
        return true;
    } else {
        return false;
    }
}



function afegirCotxe() {
    // Jo pare l'enviament del formulari

    // Jo llija els valors del formulari
    // TOTS estos IDs els canviaré segons l'HTML de l'examen
    const marca = document.getElementById('marca').value;
    const model = document.getElementById('model').value;
    const preu = Number(document.getElementById('preu').value);
    const any = Number(document.getElementById('any').value);
    const quilometres = Number(document.getElementById('quilometres').value);
    const combustible = document.getElementById('combustible').value;

    
    // Jo cree l'objecte cotxe nou
    const nouCotxe = {
        id: generarId(),
        marca: marca,
        model: model,
        preu: preu,
        any: any,
        quilometres: quilometres,
        combustible: combustible
    };
    
    // Jo afegisc el nou cotxe a l'array original
    dadesOriginals.push(nouCotxe);

    // Actualitze dadesActuals per a mostrar-ho immediatament
    dadesActuals = dadesOriginals.slice();

    // Guarde l'array actualitzat en localStorage
    localStorage.setItem(CLAU_STORAGE, JSON.stringify(dadesOriginals));

    // Torne a pintar el llistat
    prepararAutocomplete(dadesActuals);
    pintarLlistat(dadesActuals);
    buidarCamps();
}
function buidarCamps(){
    document.getElementById('marca').value = '';
    document.getElementById('model').value = '';
    document.getElementById('preu').value = '';
    document.getElementById('any').value = '';
    document.getElementById('quilometres').value = '';
    document.getElementById('combustible').value = '';
}

function generarId() {
    // Jo genere un id senzill basat en el temps
    return 'c' + Date.now();
}

function eliminarCotxePerId(idEliminar) {
    // Filtre dadesOriginals per eliminar l'element amb aquest id
    dadesOriginals = dadesOriginals.filter(function (cotxe) {
        return cotxe.id !== idEliminar;
    });

    // Actualitze dadesActuals per a mostrar-ho
    dadesActuals = dadesOriginals.slice();

    // Guarde l'array actualitzat en localStorage
    localStorage.setItem(CLAU_STORAGE, JSON.stringify(dadesOriginals));

    // Torne a pintar el llistat
    pintarLlistat(dadesActuals);
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
    /*document.getElementById('formulariCotxe') .addEventListener('submit', validar);*/
    document.getElementById('afegir').addEventListener('click', validar);
    document.getElementById('btnFiltrarCOSAS').addEventListener('click',aplicarFiltresAnyKm);

}
