// Selectores
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
// Variables globales
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

// const paginacionDiv = document.querySelector('#paginacion');

// window.onload = () => {
//     formulario.addEventListener('submit', validarFormulario);
// }

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarFormulario);
})

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
    
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '31491259-efefdf130de442d5041c19252';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    // console.log(url);
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => {
    //         totalPaginas = calcularPaginas(resultado.totalHits);
    //         // console.log(totalPaginas);
    //         mostrarImagenes(resultado.hits);
    //     });
    
    try{
       const respuesta = await fetch(url);
       const resultado = await respuesta.json(); 
       totalPaginas = calcularPaginas(resultado.totalHits);
       mostrarImagenes(resultado.hits);
    } catch(error){
        console.log(error);
    }
}

// Paginación
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        // console.log(i);
        yield i;
    }
}

function mostrarImagenes(imagenes) {
    // console.log(imagenes);
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold">${views} <span class="font-light">Veces Vista</span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >Ver Imagen</a>
                    </div>
                </div>
            </div>
        `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    // Generar el nuevo HTML
    ImprimirPaginador();
}


function ImprimirPaginador() {
    
    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next());
    // console.log(iterador.next().value);
    // console.log(iterador.next().done);
    while(true) {
        const { value, done } = iterador.next();
        if(done) return;
        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-1', 'ml-1', 'font-bold', 'mb-10', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            console.log(paginaActual);
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }

}
