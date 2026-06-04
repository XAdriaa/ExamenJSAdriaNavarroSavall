document.addEventListener("DOMContentLoaded",main);

async function main(){
    await extraerDatos();
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