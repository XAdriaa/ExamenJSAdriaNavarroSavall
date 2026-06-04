/**
 * index.js
 * Desarrollador: Senior Dev / Corrector 2º DAW
 * Propósito: Cargar hipercoches, mostrarlos en el DOM, aplicar filtros combinados y autocompletado.
 */

// Se añade un "escuchador" al documento para que la función 'main' se ejecute 
// únicamente cuando todo el HTML (DOM) haya sido completamente cargado y parseado.
document.addEventListener("DOMContentLoaded", main);

// ==========================================
// VARIABLES GLOBALES
// ==========================================
// 'cochesOriginales' actúa como nuestra base de datos inmutable en memoria. 
// Nunca se modifica después de la carga inicial.
let cochesOriginales = [];

// 'cochesFiltrados' es el array de trabajo. Sufre modificaciones (filtros, ordenaciones) 
// y es el que realmente se usa para pintar los coches en pantalla.
let cochesFiltrados = [];

// Estado inicial del ordenamiento de la lista.
let ordenActual = 'relevancia';

/**
 * Función principal que actúa como punto de entrada de la aplicación.
 * Se encarga de lanzar la carga de datos y establecer los manejadores de eventos (Event Listeners).
 */
function main() {
    // 1. Iniciar la petición HTTP para obtener los datos.
    cargarDatos();

    // 2. Asignar Event Listeners a los controles de la interfaz:
    
    // Botón principal de filtrar (dentro de un formulario)
    document.getElementById("filtrar").addEventListener("click", function(e) {
        e.preventDefault(); // Previene que el formulario recargue la página al enviarse
        applyFilters();
    });

    // Botones secundarios de la barra de filtros
    document.getElementById("eliminarFiltro").addEventListener("click", resetFilters);
    document.getElementById("ir").addEventListener("click", applyFilters);

    // Botones de ordenación (Relevancia, Precio Alto, Precio Bajo)
    document.getElementById("relevancia").addEventListener("click", function() {
        ordenActual = 'relevancia';
        sortCars();
    });

    document.getElementById("precioAlto").addEventListener("click", function() {
        ordenActual = 'precioAlto';
        sortCars();
    });

    document.getElementById("precioBajo").addEventListener("click", function() {
        ordenActual = 'precioBajo';
        sortCars();
    });
}

/**
 * Elimina todos los nodos hijos de un elemento HTML de forma segura.
 * Es más seguro y eficiente que usar `elemento.innerHTML = ""` ya que 
 * evita posibles ataques XSS y ayuda al recolector de basura (garbage collector)
 * a liberar memoria borrando los nodos uno a uno.
 * * @param {HTMLElement} elemento - El nodo del DOM que se desea vaciar.
 */
function vaciarElemento(elemento) {
    // Mientras el elemento tenga un primer hijo, se elimina.
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

/**
 * Realiza una petición asíncrona (AJAX) para cargar el archivo JSON con los datos.
 * Incluye un sistema de "fallback" (plan B) por si la petición falla (ej. problemas de CORS en local).
 */
function cargarDatos() {
    fetch('./BD/bd.json') // Promesa: Intenta obtener el archivo JSON
        .then(response => response.json()) // Transforma la respuesta HTTP a un objeto JavaScript
        .then(data => {
            // Si tiene éxito, guarda los datos en la variable global y arranca la app
            cochesOriginales = data.cars;
            inicializarApp();
        })
        .catch(error => {
            // Si hay un error (ej. ruta incorrecta, bloqueo de navegador en local), entra aquí.
            console.warn("Fallo al cargar bd.json. Usando datos locales de respaldo.", error);
            
            // Fallback: Datos embebidos directamente en el código.
            cochesOriginales = [
                { "marca": "MCLAREN", "modelo": "650S Spyder", "precio": "159999", "anyo": "2016", "km": "19000", "cambio": "Automático", "combustible": "Gasolina", "img": "mclarenSpider650.jpg" },
                { "marca": "FORD", "modelo": "Mustang GT", "precio": "50000", "anyo": "2019", "km": "46000", "cambio": "Automático", "combustible": "Gasolina", "img": "mustang.jpg" }
            ];
            inicializarApp();
        });
}

/**
 * Prepara el estado inicial de la aplicación una vez que los datos ya están en memoria.
 */
function inicializarApp() {
    // El operador spread [...] crea una copia por valor (independiente) del array original.
    cochesFiltrados = [...cochesOriginales]; 
    
    // Ejecutamos las funciones de inicialización de la vista
    llenarSelectAnyos();
    autocompleteInit();
    renderCars(); // Pinta los coches por primera vez
}

/**
 * Genera dinámicamente las opciones de los selectores de "Año Desde" y "Año Hasta"
 * basándose únicamente en los años de los coches que existen en la base de datos.
 */
function llenarSelectAnyos() {
    let selectDesde = document.getElementById("anyoDesde");
    let selectHasta = document.getElementById("anyoHasta");

    // 1. Extraer un array solo con los años (convertidos a número)
    let anyos = cochesOriginales.map(c => parseInt(c.anyo));
    
    // 2. Eliminar duplicados usando 'Set' y ordenar de menor a mayor
    let anyosUnicos = [...new Set(anyos)].sort((a, b) => a - b);

    // 3. Crear las opciones por defecto (0 para el mínimo, 9999 para el máximo)
    let optDefDesde = document.createElement("option");
    optDefDesde.value = "0";
    optDefDesde.appendChild(document.createTextNode("Año Desde"));
    selectDesde.appendChild(optDefDesde);

    let optDefHasta = document.createElement("option");
    optDefHasta.value = "9999";
    optDefHasta.appendChild(document.createTextNode("Año Hasta"));
    selectHasta.appendChild(optDefHasta);

    // 4. Iterar sobre los años únicos y crear elementos <option> para ambos selects
    anyosUnicos.forEach(anyo => {
        let opt1 = document.createElement("option");
        opt1.value = anyo.toString();
        opt1.appendChild(document.createTextNode(anyo.toString()));
        selectDesde.appendChild(opt1);

        let opt2 = document.createElement("option");
        opt2.value = anyo.toString();
        opt2.appendChild(document.createTextNode(anyo.toString()));
        selectHasta.appendChild(opt2);
    });
}

/**
 * Pinta en el DOM las tarjetas de los vehículos que están en 'cochesFiltrados'.
 * Utiliza estrictamente la API del DOM (createElement) como buena práctica.
 */
function renderCars() {
    let listado = document.getElementById("listado");
    vaciarElemento(listado); // Limpiamos el contenedor antes de repintar

    // Iteramos sobre el array de coches filtrados
    cochesFiltrados.forEach(coche => {
        
        // --- Creación de la estructura HTML de la tarjeta (Card) ---
        // <div class="card mb-4">
        let divCard = document.createElement("div");
        divCard.classList.add("card", "mb-4");

        // Enlace e imagen
        let aImg = document.createElement("a");
        aImg.setAttribute("href", "#!");
        let img = document.createElement("img");
        img.classList.add("card-img-top");
        img.setAttribute("src", "img/" + coche.img);
        img.setAttribute("alt", coche.marca + " " + coche.modelo);
        aImg.appendChild(img);
        divCard.appendChild(aImg);

        // Cuerpo de la tarjeta
        let divBody = document.createElement("div");
        divBody.classList.add("card-body");

        // Título del coche
        let h2Title = document.createElement("h2");
        h2Title.classList.add("card-title");
        h2Title.appendChild(document.createTextNode(coche.marca + " " + coche.modelo));
        divBody.appendChild(h2Title);

        // Fila para el precio
        let divPrecioRow = document.createElement("div");
        divPrecioRow.classList.add("row", "justify-content-end");
        let divPrecioCol = document.createElement("div");
        divPrecioCol.classList.add("p-2", "mb-1", "col-md-3", "offset-md-3", "bg-warning", "rounded", "text-center");
        let h2Precio = document.createElement("h2");
        h2Precio.classList.add("font-weight-bold");
        
        // Formatear precio para que se vea con puntos de miles y el símbolo de Euro
        let precioFormat = new Intl.NumberFormat('es-ES').format(coche.precio) + " €";
        h2Precio.appendChild(document.createTextNode(precioFormat));
        
        divPrecioCol.appendChild(h2Precio);
        divPrecioRow.appendChild(divPrecioCol);
        divBody.appendChild(divPrecioRow);

        // Fila para la tabla de características
        let divTablaRow = document.createElement("div");
        divTablaRow.classList.add("row");

        // Cabeceras de la tabla (Año, Km, Cambio, Combustible)
        let cabeceras = ["Año", "Kilometros", "Cambio", "Combustible"];
        cabeceras.forEach(texto => {
            let colCab = document.createElement("div");
            colCab.classList.add("col", "p-3", "text-center", "border-bottom", "border-dark");
            colCab.appendChild(document.createTextNode(texto));
            divTablaRow.appendChild(colCab);
        });

        // Este div vacío con la clase w-100 fuerza un salto de línea en Flexbox de Bootstrap
        let divW100 = document.createElement("div");
        divW100.classList.add("w-100");
        divTablaRow.appendChild(divW100);

        // Valores asociados a las cabeceras
        let valores = [coche.anyo, coche.km + " Km.", coche.cambio, coche.combustible];
        valores.forEach(val => {
            let colVal = document.createElement("div");
            colVal.classList.add("col", "p-3", "text-center");
            let strongVal = document.createElement("strong");
            strongVal.appendChild(document.createTextNode(val));
            colVal.appendChild(strongVal);
            divTablaRow.appendChild(colVal);
        });

        divBody.appendChild(divTablaRow);

        // Botón de Reservar
        let btnReserva = document.createElement("a");
        btnReserva.classList.add("btn", "btn-primary", "m-3");
        btnReserva.setAttribute("href", "#!");
        btnReserva.appendChild(document.createTextNode("Reservar"));
        
        // EVENTO CRÍTICO: Guardar en LocalStorage
        // En lugar de pasar IDs por la URL, almacenamos todo el objeto JSON del coche
        // en el almacenamiento del navegador para que "reserva.html" pueda leerlo fácilmente.
        btnReserva.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.setItem("cocheSeleccionado", JSON.stringify(coche)); // Convertir objeto a texto
            window.location.href = "reserva.html"; // Redirigir
        });

        // Ensamblaje final de la tarjeta
        divBody.appendChild(btnReserva);
        divCard.appendChild(divBody);
        listado.appendChild(divCard);
    });
}

/**
 * Valida que los rangos numéricos introducidos por el usuario tengan sentido lógico.
 * Evita búsquedas contradictorias (ej. Año desde 2020 hasta 2010).
 * * @returns {boolean} true si los datos son válidos, false si hay errores lógicos.
 */
function validateFilters(numAnyoDesde, numAnyoHasta, numKmDesde, numKmHasta) {
    let errorContainer = document.getElementById("errorMensaje");
    vaciarElemento(errorContainer); // Limpiamos errores previos

    let esValido = true;

    if (numAnyoDesde > numAnyoHasta) {
        errorContainer.appendChild(document.createTextNode("Error crítico: El Año 'Desde' no puede ser mayor que el Año 'Hasta'."));
        esValido = false;
    }

    if (numKmDesde > numKmHasta) {
        let br = document.createElement("br");
        if (!esValido) errorContainer.appendChild(br); // Añade un salto de línea si ya había un error previo
        errorContainer.appendChild(document.createTextNode("Error crítico: Los Kilómetros 'Desde' no pueden ser mayores que 'Hasta'."));
        esValido = false;
    }

    return esValido;
}

/**
 * Recupera los valores de todos los controles del formulario,
 * los valida, y aplica todas las condiciones simultáneamente para reducir el array original.
 */
function applyFilters() {
    // Recuperar valores o establecer valores por defecto (fallbacks) usando el operador lógico OR (||)
    let anyoDesde = parseInt(document.getElementById("anyoDesde").value) || 0;
    let anyoHasta = parseInt(document.getElementById("anyoHasta").value) || 9999;
    let kmDesde = parseInt(document.getElementById("kmDesde").value) || 0;
    let kmHasta = parseInt(document.getElementById("kmHasta").value) || 10000000;
    
    // Obtener el radio button que esté seleccionado en ese momento
    let cambio = document.querySelector('input[name="cambio"]:checked').value;
    let combustible = document.getElementById("combustible").value;
    
    // Búsqueda por texto (convertida a minúsculas para hacerla case-insensitive)
    let busqueda = document.getElementById("marcaModelo").value.toLowerCase();

    // 1. Validar que la lógica de los números sea correcta
    if (!validateFilters(anyoDesde, anyoHasta, kmDesde, kmHasta)) {
        return; // Si la validación devuelve 'false', salimos de la función sin filtrar
    }

    // 2. Aplicar el método de array .filter()
    // Retorna un nuevo array solo con los elementos que devuelvan 'true' en la función.
    cochesFiltrados = cochesOriginales.filter(coche => {
        let carAnyo = parseInt(coche.anyo);
        let carKm = parseInt(coche.km);

        // Evaluaciones lógicas individuales (devuelven true o false)
        let matchAnyo = carAnyo >= anyoDesde && carAnyo <= anyoHasta;
        let matchKm = carKm >= kmDesde && carKm <= kmHasta;
        let matchCambio = (cambio === "") || (coche.cambio === cambio);
        let matchCombustible = (combustible === "") || (coche.combustible === combustible);
        
        let stringBusquedaCoche = (coche.marca + " " + coche.modelo).toLowerCase();
        let matchBusqueda = stringBusquedaCoche.indexOf(busqueda) !== -1; // -1 significa "no encontrado"

        // Retorna true solo si TODAS las variables anteriores son true
        return matchAnyo && matchKm && matchCambio && matchCombustible && matchBusqueda;
    });

    // 3. Una vez filtrado, mandamos los resultados a la función de ordenación (que a su vez los repintará)
    sortCars();
}

/**
 * Ordena numéricamente el array de 'cochesFiltrados' basándose en la variable global 'ordenActual'.
 */
function sortCars() {
    if (ordenActual === 'precioAlto') {
        // Orden descendente (de mayor a menor)
        cochesFiltrados.sort((a, b) => parseInt(b.precio) - parseInt(a.precio));
    } else if (ordenActual === 'precioBajo') {
        // Orden ascendente (de menor a mayor)
        cochesFiltrados.sort((a, b) => parseInt(a.precio) - parseInt(b.precio));
    } else {
        // Si es 'relevancia', el método .sort() convencional no nos sirve directamente
        // porque altera el array in-place y perdemos el orden por defecto del JSON.
        applyFiltersRelevancia();
        return; // Salimos prematuramente porque applyFiltersRelevancia ya llama a renderCars()
    }
    
    // Pinta la lista ordenada en el HTML
    renderCars();
}

/**
 * Restaura el orden original (el que tenía el JSON al descargarse), 
 * basándose en el índice o posición que ocupan los elementos en el array 'cochesOriginales'.
 */
function applyFiltersRelevancia() {
    let oldOrder = ordenActual; // Guardamos el estado actual
    ordenActual = null; // Desactivamos temporalmente el orden para no crear un bucle infinito
    
    // Compara la posición del elemento A frente al B en el array maestro (cochesOriginales).
    // Si A estaba antes que B, indexOf(A) será menor, por lo que devuelve un número negativo,
    // manteniendo a A por delante de B.
    cochesFiltrados.sort((a, b) => {
       return cochesOriginales.indexOf(a) - cochesOriginales.indexOf(b);
    });

    ordenActual = oldOrder; // Restauramos la variable global
    renderCars(); // Pintamos los resultados
}

/**
 * Resetea por completo los filtros y limpia la vista para volver al estado inicial.
 */
function resetFilters(e) {
    if(e) e.preventDefault(); // Evita salto hacia el top de la página si es un <a>

    // Reset nativo de HTMLForms. Devuelve inputs, radios y selects a sus values iniciales
    document.querySelector("form").reset();
    document.getElementById("marcaModelo").value = ""; 
    
    // Limpiamos la caja de mensajes de error de validación
    vaciarElemento(document.getElementById("errorMensaje"));

    // Restauramos el array de trabajo clonando de nuevo el array original inmutable
    cochesFiltrados = [...cochesOriginales];
    
    // Restauramos el orden por defecto
    ordenActual = 'relevancia';
    
    // Repintamos la aplicación limpia
    renderCars();
}

/**
 * Función que aprovecha la librería jQuery UI (si está importada en el HTML)
 * para convertir el input de texto en un buscador con autocompletado predictivo.
 */
function autocompleteInit() {
    // Extraemos de la base de datos un array de strings combinando "Marca Modelo"
    let etiquetasBusqueda = cochesOriginales.map(c => c.marca + " " + c.modelo);
    
    // Pasamos el array por un objeto Set para eliminar posibles vehículos repetidos.
    let etiquetasUnicas = [...new Set(etiquetasBusqueda)];

    // Inicialización del widget de jQuery UI asociado al id #marcaModelo
    $("#marcaModelo").autocomplete({
        source: etiquetasUnicas // Fuente de datos predictivos
    });
}