document.addEventListener("DOMContentLoaded",main);

async function main(){
    await extraerDatos();

    pintarLocal();
}

async function extraerDatos(){
    try{
        const res = await fetch('./data/data.json');

        
        if(!res.ok){
            throw new error("Error en la extraccion de lo datos");
        };

        const data = await res.json();

        console.log(data);

        localStorage.setItem("data",JSON.stringify(data));

    }catch(error){
        console.log('Error-consulta:', error.message);
    }
}

function pintarLocal(){
    let dataLocal = JSON.parse(localStorage.getItem("data"));
    let dataSchedule = dataLocal.schedules
    
    

    let horario = dataSchedule[0]

    console.log("Extrau Local", horario.times);

    const table = document.getElementById("table");

    horario.times.forEach(element => {
        const tr = document.createElement("tr");

        
        

        const tdID = document.createElement("td")
        const NodeID = document.createTextNode(element.id);
        tdID.appendChild(NodeID);

        const tdNombre = document.createElement("td")
        const NodeNombre = document.createTextNode(element.name);
        tdNombre.appendChild(NodeNombre);

        const tdHora = document.createElement("td")
        const NodeHora = document.createTextNode(element.hour);
        tdHora.appendChild(NodeHora);

        const tdDuracion = document.createElement("td")
        const NodeDuracion = document.createTextNode(element.duration);
        tdDuracion.appendChild(NodeDuracion);

        const tdCancion = document.createElement("td")
        const NodeCancion = document.createTextNode(element.songId);
        tdCancion.appendChild(NodeCancion);

        const tdAccion = document.createElement("td")
        const btnEliminar = document.createElement("button");
        const Nodebtn = document.createTextNode("Borrar");
        btnEliminar.classList.add("btn", "btn-outline-danger");
        btnEliminar.appendChild(Nodebtn);
        tdAccion.appendChild(btnEliminar);
        
        tr.appendChild(tdID);
        tr.appendChild(tdNombre);
        tr.appendChild(tdHora);
        tr.appendChild(tdDuracion);
        tr.appendChild(tdCancion)
        tr.appendChild(tdAccion);

        table.appendChild(tr);
    });

    
}