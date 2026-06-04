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
    let ordreActual;

    // Esta variable em permet recordar quina ordenació està activa
    ordreActual = 'relevancia';

    // Ací jo carregue el JSON (canviaré la ruta si cal)
    carregarJSON();


    prepararBotons();
}
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
            // El JSON NO sol ser un array directe
            // Normalment serà data.User, data.Product, etc.

            // Ací jo trie exactament l'array que vull mostrar
            dadesOriginals = data.Cars; // <- canviar User segons l'enunciat

            // Jo faig una còpia per a poder filtrar sense perdre l'original
            dadesActuals = dadesOriginals.slice();

            // Jo pinte les dades inicials tal com venen en el JSON
            pintarLlistat(dadesActuals);

            // Si el JSON té altres seccions (Category, Brand, etc.)
            // jo les utilitze per a omplir selects o filtres
                        prepararFiltres(data);


            // Jo prepare l'autocomplete amb jQuery UI
        })
        .catch(function (error) {
            // Si alguna cosa falla, jo ho mostre per consola
            console.error('Error carregant el JSON', error);
        });
}

function pintarLlistat(element) {

    const tabla = document.getElementById('llistat');


    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild)
    }


    dadesActuals.forEach(element => {
        console.log(element);
        const div = document.createElement('div');
        div.classList.add('item');

        const titol = document.createElement('h3');
        titol.appendChild(document.createTextNode(element.marca))

        const subtitul = document.createElement('h4');
        subtitul.appendChild(document.createTextNode(element.model))

        const preu = document.createElement('p');
        preu.appendChild(document.createTextNode(element.preu + ' €'))

        const botoEliminar = document.createElement('button');
        botoEliminar.appendChild(document.createTextNode('X'));
        // Jo associe l'id de l'element al botó (NO al DOM visual)
        botoEliminar.dataset.id = element.id;

        div.appendChild(titol);
        div.appendChild(subtitul);
        div.appendChild(preu);
        div.appendChild(botoEliminar);

        tabla.appendChild(div);



    });


}

function prepararBotons() {
    document.getElementById("btnFiltrar").addEventListener("click", aplicarFiltres);
    document.getElementById("btnEliminarFiltres").addEventListener("click",eliminarFiltres)
    document.getElementById('btnAsc').addEventListener('click', ordenarAsc);
    document.getElementById('btnDesc').addEventListener('click', ordenarDesc);
    document.getElementById('formulariCotxe') .addEventListener('submit', afegirCotxe);
    

}



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

function saludar() {
    console.log("Tengo ganas de irme a vivir con vistor");

}
function afegirCotxe(event) {
    // Jo pare l'enviament del formulari
    event.preventDefault();

    // Jo llija els valors del formulari
    // TOTS estos IDs els canviaré segons l'HTML de l'examen
    const marca = document.getElementById('marca').value;
    const model = document.getElementById('model').value;
    const preu = Number(document.getElementById('preu').value);
    const any = Number(document.getElementById('any').value);
    const quilometres = Number(document.getElementById('quilometres').value);
    const combustible = document.getElementById('combustible').value;

    // Jo cree l'objecte cotxe nou
    const cotxeNou = {
        id: generarId(),
        marca: marca,
        model: model,
        preu: preu,
        any: any,
        quilometres: quilometres,
        combustible: combustible
    };

    // Jo afegisc el cotxe a les dades originals
    dadesOriginals.push(cotxeNou);

    // IMPORTANT:
    // Després d'afegir, jo torne a aplicar filtres i ordenació
    dadesActuals = dadesOriginals.slice();

    // Jo torne a pintar el llistat
    pintarLlistat(dadesActuals);

    // Opcional però molt bé vist:
    // Jo reinicie el formulari
    event.target.reset();
}
function generarId() {
    // Jo genere un id senzill basat en el temps
    return 'c' + Date.now();
}





function prepararFiltres(data) {
    // Exemple de com omplir un select dinàmicament
    // Canviaré 'filtreRol' pel select real de l'examen
    const select = document.getElementById('filtreRol');

    // Jo recórrec les categories o rols del JSON
    data.Cars.forEach(function (cat) {
        console.log(cat);
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

    // I torne a pintar
    pintarLlistat(dadesActuals);
}

function eliminarFiltres() {
    // Quan premen "Eliminar filtres"
    // Jo recupere totes les dades originals
    dadesActuals = dadesOriginals.slice();

    // Jo respecte l'ordenació que estava activa
    // Jo repinte el llistat
    pintarLlistat(dadesActuals);
}

