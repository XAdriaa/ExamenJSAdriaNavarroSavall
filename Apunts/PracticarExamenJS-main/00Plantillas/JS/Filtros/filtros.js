document.addEventListener("DOMContentLoaded",main)

function main(){

    document
    .getElementById("Aplicar")
    .addEventListener("click",filtrarDatos)
}

function filtrarDatos(event){
    event.preventDefault();

    let dataLocal = JSON.parse(localStorage.getItem("data"));

    //Para obtener los datos de los select se utiliza el ID de la etiqueta select y .value
    let desde = document.getElementById("desde").value;
    let hasta = document.getElementById("hasta").value;



    console.log("Flitrar datos llamada","Desde",desde, " ", "Hasta",hasta,"Datos Local", dataLocal);

    let dataFiltrada = dataLocal.filtre();

}