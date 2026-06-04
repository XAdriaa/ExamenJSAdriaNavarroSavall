document.addEventListener("DOMContentLoaded",main);

async function main(){

    await extraerJson();

    mostrarDatos();
    
}

async function extraerJson(){
    try{
        //Ruta del archivo del cual queremos sacar los datos
        const res = await fetch('/00Plantillas/DB/JSON/data.json');

        //Ponemos
        if(!res){
            throw new error("Error en la extraccion de lo datos");
        };

        const data = await res.json();

        console.log(data);

        localStorage.setItem("data",JSON.stringify(data));

    }catch(error){
        console.log('Error-consulta:', error.message);
    }
}



function mostrarDatos(){

    let dataWeb = JSON.parse(localStorage.getItem("data"));

    console.log("datos en la funcion pintar",dataWeb);

    const div = document.getElementById("contenedor");

    dataWeb.usuarios.forEach(element => {
        const table = document.createElement("table");
        table.classList.add("table");
        const tr = document.createElement("tr");
        

        const tdNombre = document.createElement("td");
        const tdNodeNombre = document.createTextNode(element.nombre);
        tdNombre.appendChild(tdNodeNombre);
        tr.appendChild(tdNombre);

        const tdApellido = document.createElement("td");
        const tdNodeApellido = document.createTextNode(element.apellidos);
        tdApellido.appendChild(tdNodeApellido);
        tr.appendChild(tdApellido);

        const tdEmail = document.createElement("td");
        const tdNodeEmail = document.createTextNode(element.correo);
        tdEmail.appendChild(tdNodeEmail);
        tr.appendChild(tdEmail);

        const tdFecha = document.createElement("td");
        const tdNodeEdad = document.createTextNode(element.fechaNacimiento);
        tdFecha.appendChild(tdNodeEdad);
        tr.appendChild(tdFecha);



        table.appendChild(tr);
        div.appendChild(table);
    });
}