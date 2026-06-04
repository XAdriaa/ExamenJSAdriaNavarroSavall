document.addEventListener("DOMContentLoaded",main);

async function main(){
    await extraerData();


    pintarTaula()

}

async function extraerData() {

    // Iniciamos un bloque try para intentar ejecutar el código
    try {
        // 'fetch' realiza la petición al archivo. 
        // 'await' detiene la ejecución hasta que el servidor responda.
        const res = await fetch('./BD/bd.json');

        // Verificamos si la respuesta fue exitosa (status 200-299).
        if (!res.ok) {
            // Si hay un error, lanzamos una excepción manualmente.
            throw new Error('No se ha podido obtener el archivo');
        }

        // 'res.json()' extrae el contenido JSON del cuerpo de la respuesta.
        // Como este proceso también es asíncrono, usamos 'await'.
        const data = await res.json();

        // Si todo salió bien, imprimimos los datos en la consola.
        console.log(data);
        
        //Guardamos en el localStorage
        localStorage.setItem("data",JSON.stringify(data));
    } catch (error) {
        // Si ocurre cualquier error en el bloque 'try', el código salta aquí.
        // Imprimimos un mensaje personalizado con el detalle del error.
        console.error('Error-consulta:', error.message);
    }
}


function pintarTaula(){

    let dataLocalRaw = localStorage.getItem("data");
    let dataLocal = JSON.parse(dataLocalRaw).cars;


    repintarTaula(dataLocal);
    

    fillSelect(dataLocal,"anyoDesde");
    fillSelect(dataLocal,"anyoHasta");

    const filtro = document.getElementById("filtrar");
    filtro.addEventListener("click",filtrarAño);

    // Búsqueda por marca o modelo con jQuery
    $("#marcaModelo").on("keyup", function () {

    // Obtenemos el texto introducido, quitamos espacios y lo pasamos a minúsculas
    // para que la comparación no sea sensible a mayúsculas
    let textoBusqueda = $("#marcaModelo").val().trim().toLowerCase();

    let dataLocal = JSON.parse(localStorage.getItem("data")).cars;

    // Filtramos los coches cuya marca O modelo contengan el texto buscado
    // includes() comprueba si el string contiene la subcadena
    let dataFiltrada = dataLocal.filter(car =>
        car.marca.toLowerCase().includes(textoBusqueda) ||
        car.modelo.toLowerCase().includes(textoBusqueda)
    );

    repintarTaula(dataFiltrada);
});

// También busca al pulsar Enter dentro del input
$("#marcaModelo").on("keypress", function (event) {
    // keyCode 13 es la tecla Enter
    if (event.keyCode === 13) {
        $("#ir").trigger("click");
    }
});

}

function repintarTaula(data) {


    const div = document.getElementById("listado");

    //Mientras exista algún hijo dentro del tbody...
    while (div.firstChild) {
        //Elimina el primer hijo.
        //Esto limpia completamente la tabla.
        div.removeChild(div.firstChild);

    }

    data.forEach(element => {

        //Estructura card------------------------------------------------------------
        const divCard = document.createElement("div");
        divCard.classList.add("card");
        
        //Imagen card----------------------------------------------------------------
        const imgCoche = document.createElement("img");
        imgCoche.src = "./img/" + element.img
        imgCoche.alt = "Imagen no disponible";
        imgCoche.classList.add("card-img");

        divCard.appendChild(imgCoche)

        //Cuerpo card----------------------------------------------------------------
        const divCardBody = document.createElement("div");
        divCardBody.classList.add("card-body");

        //Titulo card----------------------------------------------------------------
        const nombreEti = document.createElement("p");
        const nombreNode = document.createTextNode(element.marca + element.modelo);
        nombreEti.classList.add("fs-3","card-title");
        nombreEti.appendChild(nombreNode);

        
        //Contenedor texto precio card-----------------------------------------------
        const precioCont = document.createElement("div");
        precioCont.classList.add("d-flex","justify-content-end");

        //Precio card----------------------------------------------------------------
        const precioEti = document.createElement("button");
        const precioNode = document.createTextNode(element.precio + " €");
        precioEti.classList.add("bg-warning","border-0","fs-4","p-2");
        precioEti.appendChild(precioNode);
        precioCont.appendChild(precioEti);

        //Contenedor tabla-----------------------------------------------------------
        const divTable = document.createElement("div");
        divTable.classList.add("justify-content-center","d-flex");

        //Tabla etiquetas------------------------------------------------------------
        const tabla = document.createElement("table");
        //Titulos fijos
        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        const th3 = document.createElement("th");
        const th4 = document.createElement("th");
        //Contenido dinamico
        const trF = document.createElement("tr");
        const trD = document.createElement("tr");

        divTable.appendChild(tabla);

        //Tabla contenido------------------------------------------------------------
        //Nombre fijos
        const añoTH = document.createTextNode("Año");
        const kilometrosTH = document.createTextNode("Kilometros");
        const cambiosTH = document.createTextNode("Cambios");
        const combustibleTH = document.createTextNode("Combustible");

        //Añadir fijos a las etiquetas-----------------------------------------------
        th1.appendChild(añoTH);
        tabla.appendChild(th1);
        th2.appendChild(kilometrosTH);
        tabla.appendChild(th2);
        th3.appendChild(cambiosTH);
        tabla.appendChild(th3);
        th4.appendChild(combustibleTH);
        tabla.appendChild(th4);
        
        trF.appendChild(th1);
        trF.appendChild(th2);
        trF.appendChild(th3);
        trF.appendChild(th4);
        tabla.appendChild(trF);

        //Contenido dinamico---------------------------------------------------------
        const tdAño = document.createElement("td");
        const añoNode = document.createTextNode(element.anyo);
        tdAño.appendChild(añoNode);
        trD.appendChild(tdAño);
        tabla.appendChild(trD);

        
        const tdKM = document.createElement("td");
        const kmNode = document.createTextNode(element.km);
        tdKM.appendChild(kmNode);
        trD.appendChild(tdKM);
        tabla.appendChild(trD);

        const tdCambio = document.createElement("td");
        const cambioNode = document.createTextNode(element.cambio);
        tdCambio.appendChild(cambioNode);
        trD.appendChild(tdCambio);
        tabla.appendChild(trD);

        const tdCombustible = document.createElement("td");
        const combustibleNode = document.createTextNode(element.combustible);
        tdCombustible.appendChild(combustibleNode);
        trD.appendChild(tdCombustible);
        tabla.appendChild(trD);

        //Boton de reservar------------------------------------------------------------
        const aReserva = document.createElement("a");
        aReserva.href = "./reserva.html";
        const btnReserva = document.createElement("button");
        btnReserva.classList.add("btn","btn-primary");
        aReserva.appendChild(btnReserva);
        const reservarNode = document.createTextNode("Reservar");
        btnReserva.appendChild(reservarNode);
        

        divCardBody.appendChild(nombreEti);
        divCardBody.appendChild(precioCont);
        divCardBody.appendChild(divTable);
        divCardBody.appendChild(aReserva);
        divCard.appendChild(divCardBody);
        div.appendChild(divCard)
    });
}

function fillSelect(dataLocal, id) {

    // Eliminamos años duplicados y ordenamos de menor a mayor.
    // El filter recorre el array y para cada elemento comprueba si su posición (indice)
    // coincide con la primera vez que aparece ese año en el array (findIndex).
    // Si coincide, es la primera vez que aparece ese año → lo conservamos.
    // Si no coincide, es que ya había uno antes con el mismo año → lo descartamos.
    // El sort ordena los años de menor a mayor convirtiendo los strings a Number
    // para que la comparación sea numérica y no alfabética (evita que "2021" < "2008").
    let sinDuplicados = dataLocal
        .filter((valor, indice, self) => self.findIndex(item => item.anyo === valor.anyo) === indice)
        .sort((a, b) => Number(a.anyo) - Number(b.anyo));

    // Obtenemos el elemento select por su id
    const selectDesde = document.getElementById(id);

    // Limpiamos el select antes de rellenarlo
    while (selectDesde.firstChild) {
        selectDesde.removeChild(selectDesde.firstChild);
    }

    // Creamos una opción por cada año sin duplicados
    sinDuplicados.forEach(element => {
        const opciones = document.createElement("option");
        opciones.value = element.anyo;
        opciones.appendChild(document.createTextNode(element.anyo));
        selectDesde.appendChild(opciones);
    });

    // Añadimos un listener al select para detectar cuando el usuario cambia la opción.
    // Este evento "change" se dispara cada vez que el usuario selecciona un año diferente.
    selectDesde.addEventListener("change", function () {

        // "this" hace referencia al select que disparó el evento.
        // "this.value" nos da el valor de la opción que el usuario acaba de elegir.
        let valueUser = this.value;
        console.log(valueUser);

        // Comprobamos que el select que cambió es concretamente el "anyoDesde"
        // y no el "anyoHasta", ya que la misma función fillSelect añade este listener
        // a ambos selects y solo queremos reaccionar al cambio del primero.
        if (this.id === "anyoDesde") {

            // Filtramos sinDuplicados para quedarnos solo con los años
            // mayores o iguales al año elegido por el usuario.
            // Convertimos a Number porque los valores del JSON son strings
            // y la comparación >= entre strings no es fiable.
            let dataFiltrada = sinDuplicados
                .filter(element => Number(element.anyo) >= Number(valueUser));

            // Volvemos a llamar a fillSelect pasándole solo los años filtrados
            // para que el select "anyoHasta" se actualice mostrando
            // únicamente años que tengan sentido respecto al "anyoDesde" elegido.
            fillSelect(dataFiltrada, "anyoHasta");

            
        }
    });
}

function filtrarAño(event){
    event.preventDefault();

    // Obtención de los valores de todos los filtros
    const desde = Number(document.getElementById("anyoDesde").value);
    const hasta = Number(document.getElementById("anyoHasta").value);
    const kmDesde = Number(document.getElementById("kmDesde").value);
    const kmHasta = Number(document.getElementById("kmHasta").value);
    const cambio = document.querySelector('input[name="cambio"]:checked').value;
    const combustible = document.getElementById("combustible").value;

    // Sacar datos del localStorage
    let dataLocal = JSON.parse(localStorage.getItem("data")).cars;

    // Filtrado encadenado por todos los criterios
    let dataFiltrada = dataLocal.filter(car => {

        // Filtro por año
        let cumpleAño = Number(car.anyo) >= desde && Number(car.anyo) <= hasta;

        // Filtro por kilometros
        let cumpleKm = Number(car.km) >= kmDesde && Number(car.km) <= kmHasta;

        // Filtro por cambio: si el radio es "" (Todos) no filtra, si no compara
        let cumpleCambio = cambio === "" || car.cambio === cambio;

        // Filtro por combustible: si es "" (todos) no filtra, si no compara
        let cumpleCombustible = combustible === "" || car.combustible === combustible;

        // El coche solo pasa si cumple TODOS los filtros a la vez
        return cumpleAño && cumpleKm && cumpleCambio && cumpleCombustible;
    });

    repintarTaula(dataFiltrada);
}