document.addEventListener("DOMContentLoaded", main);

// Array per emmagatzemar els usuaris i rols
let usuaris = [];
let rols = [];
let llistaActual = [];

// Pàgines
let paginaActual = 1;
const usuarisPerPagina = 10;

// Funció per iniciar els esdeveniments de la pàgina
function main() { 
    // Botons per a accedir a altaUsuaris i rols
    const usuarisButton= document.getElementById("afegirUsuari");
    const rolsButton= document.getElementById("gestionarRols");

    // Filtre per nom
    const buscarNomInput = document.getElementById("buscarNomInput");
    const botoBuscarNom = document.getElementById("buscarNom");

    // Filtre per rol
    const filtreRol = document.getElementById("filtreRol");
    const botoFiltrarRol = document.getElementById("filtrar_rols");

    // Obtencio dels botons de les pàgines
    const primeraPagina = document.getElementById("primeraPagina");
    const paginaAnterior= document.getElementById("paginaAnterior");
    const paginaSeguent= document.getElementById("paginaSeguent");
    const ultimaPagina = document.getElementById("ultimaPagina");

    // Configuració del botó per a tornar al formulari d'altaUsuaris
    usuarisButton.addEventListener("click", (e) => {
        window.location.href='altaUsuaris.html';
    });

    // Configuració del botó per a tornar al formulari de rols
    rolsButton.addEventListener("click", (e) => {
        window.location.href='rols.html';
    });

    rols = JSON.parse(localStorage.getItem('rols')) || Rol;
    usuaris = JSON.parse(localStorage.getItem('usuaris')) || User;
    
    carregarRolsSelect();

    // Filtre per nom
    botoBuscarNom.addEventListener("click", () => {
        paginaActual = 1; 
        const text = buscarNomInput.value.toLowerCase();
        mostrarUsuaris(usuaris.filter(u => u.name.toLowerCase().includes(text)));
    });

    // Filtre per rol
    botoFiltrarRol.addEventListener("click", () => {
        paginaActual = 1; 
        const rolSeleccionat = filtreRol.value;
        if (rolSeleccionat === "") {
            mostrarUsuaris(usuaris);
        } else {
            mostrarUsuaris(usuaris.filter(u => u.rol_id == rolSeleccionat));
        }
    });

    // Anar a la primera página
    primeraPagina.addEventListener("click", () => {
        if (paginaActual !== 1) {
            paginaActual = 1;
            mostrarUsuaris();
        }
    });

    // Anar a la pàgina anterior
    paginaAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarUsuaris();
        }
    });

    // Anar a la seguent pàgina
    paginaSeguent.addEventListener("click", () => {
        const totalPagines = parseInt((usuaris.length + usuarisPerPagina - 1) / usuarisPerPagina);
        if (paginaActual < totalPagines) {
            paginaActual++;
            mostrarUsuaris();
        }
    });

    // Anar a la última pàgina
    ultimaPagina.addEventListener("click", () => {
        const totalPagines = parseInt((usuaris.length + usuarisPerPagina - 1) / usuarisPerPagina);
        if (paginaActual !== totalPagines) {
            paginaActual = totalPagines;
            mostrarUsuaris();
        }
    });
    
    mostrarUsuaris();
}

// Funció que s'encarrega de carregar el select amb els rols per a filtrar
function carregarRolsSelect() {
    const selectorRol = document.getElementById("filtreRol");
    selectorRol.replaceChildren(); // Netejar per si de cas

    // Opció per mostrar tots
    const optTots = document.createElement("option");
    optTots.setAttribute("value", "");
    optTots.appendChild(document.createTextNode("Tots"));
    selectorRol.appendChild(optTots);

    // Afegim cada rol real
    rols.forEach(rol => {
        const option = document.createElement("option");
        option.setAttribute("value", rol.id);
        option.appendChild(document.createTextNode(rol.name));
        selectorRol.appendChild(option);
    });
}

// Funció per mostrar tots els usuaris en una taula HTML.
function mostrarUsuaris(llistaFiltrada = usuaris) {
    const llista = document.getElementById('llistaUsuaris');

    // Buidar contingut anterior
    llista.replaceChildren();

    // Si no hi ha usuaris
    if (llistaFiltrada.length === 0) {
        const missatge = document.createElement('p');
        missatge.appendChild(document.createTextNode('No hi ha usuaris registrats'));
        llista.appendChild(missatge);
        return;
    }

    // Paginació 
    const totalPagines = parseInt((llistaFiltrada.length + usuarisPerPagina - 1) / usuarisPerPagina);
    if (paginaActual > totalPagines) paginaActual = totalPagines;

    // Aplicar paginació
    const inici = (paginaActual - 1) * usuarisPerPagina;
    const final = inici + usuarisPerPagina;
    llistaActual = llistaFiltrada.slice(inici, final);

    // Actualitzar número de pàgina
    const pagina = document.getElementById("pagina");
    pagina.setAttribute("value", paginaActual);

    // Crear taula
    const taula = document.createElement('table');
    taula.id = 'taula_usuaris';
    // Crear capçalera
    const header = document.createElement('tr');
    const columnes = ['ID', 'Usuari', 'Email', 'Nom', 'Rol', 'Accions'];
    columnes.forEach(text => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(text));
        header.appendChild(th);
    });
    taula.appendChild(header);

    // Crear files per a cada usuari
    llistaActual.forEach(usuari => {
        const fila = document.createElement('tr');

        // Camps bàsics (adaptats a les claus en anglès)
        ['id', 'nickname', 'email', 'name'].forEach(clau => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(usuari[clau]));
            fila.appendChild(td);
        });
        
        // Introduim també el rol de cada usuari
        const rol = rols.find(r => r.id === usuari.rol_id);
        const tdRol = document.createElement('td');
        tdRol.appendChild(document.createTextNode(rol.name));
        fila.appendChild(tdRol);

        // Cel·la d'accions
        const accionsTd = document.createElement('td');
        accionsTd.classList.add('accions');

        // Botó editar
        const botoEditar = document.createElement('button');
        botoEditar.appendChild(document.createTextNode('Editar'));
        botoEditar.addEventListener('click', () => editarUsuari(usuari.id));
        accionsTd.appendChild(botoEditar);

        // Botó eliminar
        const botoEliminar = document.createElement('button');
        botoEliminar.appendChild(document.createTextNode('Eliminar'));
        botoEliminar.addEventListener('click', () => eliminarUsuari(usuari.id));
        accionsTd.appendChild(botoEliminar);

        fila.appendChild(accionsTd);
        taula.appendChild(fila);
    });

    // Afegir taula al contenidor
    llista.appendChild(taula);
}

// Funció per eliminar un usuari amb confirmació.
function eliminarUsuari(id) {
    if (confirm("Estàs segur que vols eliminar aquest usuari?")) {
        usuaris = usuaris.filter(usuari => usuari.id !== id);
        guardarUsuaris();
        mostrarUsuaris(); // Actualitzar vista
    }
}

// Funció per editar un usuari - redirigeix al formulari d'edició.
function editarUsuari(id) {
    window.location.href = `altaUsuaris.html?editar=${id}`;
}

// Funció per desar els usuaris al localStorage.
function guardarUsuaris() {
    localStorage.setItem('usuaris', JSON.stringify(usuaris));
}