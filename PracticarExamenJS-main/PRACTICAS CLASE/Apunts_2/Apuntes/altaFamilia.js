document.addEventListener("DOMContentLoaded", main);

let arrFamilia = [];
let accio = "Afegir";

// Carga las familias desde la base de datos externa
function carregarFamiliesDeBBDD() {
    console.log("Cargando familias de BBDD...");
    
    // Carga los datos del archivo externo TendaFakeDades.js
    if (typeof Family !== "undefined" && Array.isArray(Family)) {
        console.log("Datos cargados de TendaFakeDades.js:", Family);
        arrFamilia = [];
        
        // Copia cada familia del array original al array de trabajo
        Family.forEach(function(f) {
            arrFamilia.push({ 
                id: f.id,
                name: f.name, 
                description: f.description,
                parent_id: f.parent_id,
                image: f.image
            });
        });
        
        // Guarda una copia en el almacenamiento local del navegador
        localStorage.setItem("families", JSON.stringify(arrFamilia));
    } else {
        console.error("ERROR: No se pudo cargar Family de TendaFakeDades.js");
        arrFamilia = [];
    }
}

// Función principal que se ejecuta al cargar la página
function main() {
    carregarFamiliesDeBBDD();
    console.log("Familias cargadas:", arrFamilia);
    
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    mostrarFamilies();
    actualitzarSelect();

    // Evento para el botón de agregar/actualizar
    afegirButton.addEventListener("click", function(e) {
        if (validar(e)) {
            if (accio === "Afegir") {
                crearFamilia();
            } else {
                actualitzarFamilia();
            }
            netejarFormulari();
            mostrarFamilies();
            actualitzarSelect();
        }
    });
}

// Limpia todos los campos del formulario
function netejarFormulari() {
    document.getElementById("nom").value = "";
    document.getElementById("familia_de").value = "";
    document.getElementById("index").value = "-1";
    document.getElementById("descripcio").value = "";
    document.getElementById("imatge").value = "";
    accio = "Afegir";
    document.getElementById("afegir").textContent = accio;
    const alerta = document.getElementById("alerta");
while (alerta.firstChild) {
    alerta.removeChild(alerta.firstChild);
}

}

// Muestra todas las familias en la tabla con estructura jerárquica
function mostrarFamilies() {
    const taula = document.getElementById("taulaFamilia");
    while (taula.firstChild) {
    taula.removeChild(taula.firstChild);
}


    console.log("Mostrando familias:", arrFamilia);

    const childrenMap = {};
    
    // Organiza las familias por su parent_id para crear la jerarquía
    arrFamilia.forEach(function(f) {
        const parentKey = f.parent_id === null ? "root" : f.parent_id;
        if (!childrenMap[parentKey]) {
            childrenMap[parentKey] = [];
        }
        childrenMap[parentKey].push(f);
    });

    // Función recursiva para mostrar familias y subfamilias
    function agregarFila(fam, nivel) {
        if (nivel === undefined) nivel = 0;
        
        const fila = document.createElement("tr");
        fila.dataset.id = fam.id;
        fila.dataset.nivel = nivel;
        
        // Aplica estilos según el nivel de jerarquía
        if (nivel > 0) {
            fila.classList.add("subfamilia", "oculto");
        }
        if (nivel === 0) {
            fila.classList.add("fam-principal");
        }

        // Formatea el nombre según el nivel
        var nombreTexto = fam.name;
        if (nivel > 0) {
            nombreTexto = '↳ ' + fam.name;
        }
        
        var fontWeight = "normal";
        if (nivel === 0) {
            fontWeight = "bold";
        }
        
        var anchoImagen = "40";
        if (nivel === 0) {
            anchoImagen = "50";
        }
        
        var imagenHTML = "";
        if (fam.image) {
            imagenHTML = '<img src="../img/' + fam.image + '" width="' + anchoImagen + '">';
        }

        // Crea el HTML de la fila
        const celdaNom = document.createElement("td");
celdaNom.style.paddingLeft = (20 * nivel) + "px";
celdaNom.style.cursor = "pointer";
celdaNom.style.fontWeight = fontWeight;
celdaNom.textContent = nombreTexto;

const celdaDesc = document.createElement("td");
celdaDesc.textContent = fam.description;

const celdaImg = document.createElement("td");
if (fam.image) {
    const img = document.createElement("img");
    img.src = "../img/" + fam.image;
    img.width = anchoImagen;
    celdaImg.appendChild(img);
}

const celdaBotons = document.createElement("td");
const btnEditar = document.createElement("button");
btnEditar.textContent = "Editar";
btnEditar.addEventListener("click", () => editarFamilia(fam.id));

const btnEliminar = document.createElement("button");
btnEliminar.textContent = "Eliminar";
btnEliminar.addEventListener("click", () => borrarFamilia(fam.id));

celdaBotons.append(btnEditar, btnEliminar);

fila.append(celdaNom, celdaDesc, celdaImg, celdaBotons);

        
        taula.appendChild(fila);

        // Si tiene subfamilias, añade funcionalidad de expandir/colapsar
        if (childrenMap[fam.id] && childrenMap[fam.id].length > 0) {
            const celdaNombre = fila.querySelector('td');
            celdaNombre.style.cursor = 'pointer';
            
                        celdaNombre.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') {
                    childrenMap[fam.id].forEach(function(hijo) {
                        const filaHijo = document.querySelector('tr[data-id="' + hijo.id + '"]');
                        if (filaHijo) {
                            filaHijo.classList.toggle("oculto");
                        }
                    });
                }
            });


            // Añade recursivamente las subfamilias
            childrenMap[fam.id].forEach(function(hijo) {
                agregarFila(hijo, nivel + 1);
            });
        }
    }

    // Muestra primero las familias principales (sin padre)
    if (childrenMap["root"]) {
        childrenMap["root"].forEach(function(fam) {
            agregarFila(fam, 0);
        });
    }
}

// Actualiza el dropdown con todas las familias disponibles
function actualitzarSelect() {
    const select = document.getElementById("familia_de");
    while (select.firstChild) {
    select.removeChild(select.firstChild);
}
const opcioBuida = document.createElement("option");
opcioBuida.value = "";
select.appendChild(opcioBuida);


    arrFamilia.forEach(function(item) {
        const opcio = document.createElement("option");
        opcio.value = item.id;
        opcio.appendChild(document.createTextNode(item.name));
        select.appendChild(opcio);
    });
}

// Guarda o actualiza una familia en el array
function guardarFamilia(nom, familia_de, descripcio, archivo, index) {
    // Calcula un nuevo ID para familias nuevas
    var newId = 1;
    if (index === null) {
        // Encuentra el ID más alto actual
        for (var i = 0; i < arrFamilia.length; i++) {
            if (arrFamilia[i].id > newId) {
                newId = arrFamilia[i].id;
            }
        }
        newId = newId + 1;
    } else {
        newId = arrFamilia[index].id;
    }
    
    // Convierte el valor del dropdown a número o null
    var parentId = null;
    if (familia_de !== "") {
        parentId = parseInt(familia_de);
    }
    
    // Maneja la imagen (nombre del archivo)
    var imagen = "";
    if (archivo) {
        imagen = archivo.name;
    } else if (index !== null) {
        imagen = arrFamilia[index].image;
    }

    const familia = {
        id: newId,
        name: nom,
        description: descripcio,
        parent_id: parentId,
        image: imagen
    };

    // Añade nueva familia o actualiza existente
    if (index === null) {
        arrFamilia.push(familia);
    } else {
        arrFamilia[index] = familia;
    }

    // Guarda los cambios en el almacenamiento local
    localStorage.setItem("families", JSON.stringify(arrFamilia));
}

// Crea una nueva familia con los datos del formulario
function crearFamilia() {
    const nom = document.getElementById("nom").value.trim();
    const familia_de = document.getElementById("familia_de").value;
    const descripcio = document.getElementById("descripcio").value.trim();
    const archivo = document.getElementById("imatge").files[0];
    
    guardarFamilia(nom, familia_de, descripcio, archivo, null);
}

// Actualiza una familia existente con los datos del formulario
function actualitzarFamilia() {
    const index = document.getElementById("index").value;
    const nom = document.getElementById("nom").value.trim();
    const familia_de = document.getElementById("familia_de").value;
    const descripcio = document.getElementById("descripcio").value.trim();
    const archivo = document.getElementById("imatge").files[0];
    
    guardarFamilia(nom, familia_de, descripcio, archivo, index);
}

// Prepara el formulario para editar una familia existente
window.editarFamilia = function(id) {
    for (var i = 0; i < arrFamilia.length; i++) {
        if (arrFamilia[i].id === id) {
            document.getElementById("index").value = i;
            document.getElementById("nom").value = arrFamilia[i].name;
            document.getElementById("familia_de").value = arrFamilia[i].parent_id || "";
            document.getElementById("descripcio").value = arrFamilia[i].description;
            document.getElementById("imatge").value = "";
            accio = "Actualitzar";
            document.getElementById("afegir").textContent = accio;
            break;
        }
    }
}

// Elimina una familia después de confirmación
window.borrarFamilia = function(id) {
    if (confirm("¿Estás seguro de que quieres borrar esta familia?")) {
        var index = -1;
        // Busca el índice de la familia a borrar
        for (var i = 0; i < arrFamilia.length; i++) {
            if (arrFamilia[i].id === id) {
                index = i;
                break;
            }
        }
        
        if (index !== -1) {
            // Verifica que no tenga subfamilias
            var tieneSubfamilias = false;
            for (var j = 0; j < arrFamilia.length; j++) {
                if (arrFamilia[j].parent_id === id) {
                    tieneSubfamilias = true;
                    break;
                }
            }
            
            if (tieneSubfamilias) {
                alert("No se puede borrar una familia que tiene subfamilias. Borra primero las subfamilias.");
                return;
            }
            
            // Elimina la familia y actualiza la visualización
            arrFamilia.splice(index, 1);
            localStorage.setItem("families", JSON.stringify(arrFamilia));
            mostrarFamilies();
            actualitzarSelect();
            
            // Si se estaba editando la familia borrada, limpia el formulario
            if (document.getElementById("index").value == index) {
                netejarFormulari();
            }
        }
    }
}

/* ---------------- VALIDACIONES ---------------- */

// Valida que el nombre cumpla los requisitos
function validarNom() {
    const element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un nom.");
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

// Valida que la descripción cumpla los requisitos
function validarDescripcio() {
    const element = document.getElementById("descripcio");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir una descripció.");
        } else if (element.validity.tooShort) {
            error(element, "La descripció ha de tindre almenys 3 caràcters.");
        } else if (element.validity.tooLong) {
            error(element, "La descripció no pot superar els 250 caràcters.");
        }
        return false;
    }
    return true;
}

// Valida el tamaño del archivo de imagen
function validarImatge() {
    const archivo = document.getElementById("imatge").files[0];
    if (archivo && archivo.size > 2 * 1024 * 1024) {
        error(document.getElementById("imatge"), "La imatge no pot pesar més de 2MB.");
        return false;
    }
    return true;
}

// Valida que una familia no sea subfamilia de sí misma
function validarSubfamilia() {
    const index = document.getElementById("index").value;
    const familia_de = document.getElementById("familia_de").value;
    if (index !== "-1" && familia_de !== "" && parseInt(index) === parseInt(familia_de)) {
        error(document.getElementById("familia_de"), "Una família no pot ser subfamília de sí mateixa.");
        return false;
    }
    return true;
}

// Función principal de validación que ejecuta todas las validaciones
function validar(e) {
    esborrarError();
    if (validarNom() && validarDescripcio() && validarImatge() && validarSubfamilia()) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
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